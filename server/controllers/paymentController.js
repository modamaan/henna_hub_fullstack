import env from "dotenv";
env.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { Resend } from "resend";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: "order_rcptid_" + Math.random().toString(36).substring(2, 10),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
};

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, userId, shippingAddressOption, deliveryMethod, deliveryFee } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
    let shippingAddress = "";
    if (shippingAddressOption === "pickup") {
        shippingAddress = "Pick up from store";
    } else {
        // Fetch user address from DB
        const user = await userModel.findById(userId);
        if (user && user.address && typeof user.address === 'object') {
            const { street = '', state = '', town = '', pincode = '' } = user.address;
            const phone = user.phone || '';
            shippingAddress = `${street}, ${town}, ${state} - ${pincode} (Phone: ${phone})`.replace(/^[,\s]+|[,\s]+$/g, '');
        } else if (user && typeof user.address === 'string') {
            const phone = user.phone || '';
            shippingAddress = `${user.address} (Phone: ${phone})`;
        } else {
            shippingAddress = "";
        }
    }
    if (generated_signature === razorpay_signature) {
        // Save order to DB
        try {
            const order = new orderModel({
                products: cart.map(i => ({
                    product: i._id || i.id,
                    quantity: i.quantity
                })),
                payment: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    status: "Success",
                    verified: true
                },
                buyer: userId,
                shippingAddress,
                deliveryMethod,
                deliveryFee,
                status: "Processing"
            });
            await order.save();

            // Send email to admin
            try {
                const adminEmail = process.env.ADMIN_EMAIL;
                const productList = cart.map(i => `- ${i.name || i.title || i._id || i.id} (Qty: ${i.quantity})`).join("<br>");
                await resend.emails.send({
                    from: `Henna Shop <no-reply@henna.com>`,
                    to: adminEmail,
                    subject: `New Order Placed (#${order._id})`,
                    html: `<h2>New Order Placed</h2>
                        <p><b>Order ID:</b> ${order._id}</p>
                        <p><b>Buyer:</b> ${userId}</p>
                        <p><b>Shipping Address:</b> ${shippingAddress}</p>
                        <p><b>Delivery Method:</b> ${deliveryMethod}</p>
                        <p><b>Delivery Fee:</b> ${deliveryFee}</p>
                        <p><b>Status:</b> Processing</p>
                        <p><b>Products:</b><br>${productList}</p>`
                });
            } catch (mailErr) {
                console.error("Failed to send admin order email:", mailErr);
            }

            return res.json({ success: true, message: "Payment verified and order saved!" });
        } catch (err) {
            return res.status(500).json({ success: false, message: "Order save failed" });
        }
    } else {
        // Optionally, you can still save a failed order for tracking
        const order = new orderModel({
            products: cart.map(i => ({
                product: i._id || i.id,
                quantity: i.quantity
            })),
            payment: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                status: "Failed",
                verified: false
            },
            buyer: userId,
            shippingAddress,
            deliveryMethod,
            deliveryFee,
            status: "Cancel"
        });
        await order.save();
        return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
};
