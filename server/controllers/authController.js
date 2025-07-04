/* eslint-disable @typescript-eslint/no-unused-vars */
import env from "dotenv";
env.config();
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, recoveryId } = req.body;
        // console.log("NewData",name,email,question)
        const requiredFields = [
            "name",
            "email",
            "password",
            "phone",
            "address",
            "recoveryId",
        ];

        // Validation
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.send({
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)
                        } is required`,
                });
            }
        }

        // Validate address fields
        const addressFields = ["street", "state", "town", "pincode"];
        for (const field of addressFields) {
            if (!address[field]) {
                return res.send({
                    message: `Address ${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                });
            }
        }

        // Check user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered Please Login",
            });
        }
        // register user
        console.log("beforeHashing", password);
        const hashedPassword = await hashPassword(password);
        console.log("AfterHashing", hashedPassword);
        //save
        const user = await new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            recoveryId,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
};

// POST/LOGIN

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not Registerd",
            });
        }
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                recoveryId: user.recoveryId,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};


// forgotPasswordContoller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, recoveryId, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!recoveryId) {
            res.status(400).send({ message: "recovery ID is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, recoveryId });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or recovery ID",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {
            password: hashed,
        });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: "Something Went Wrong",
            error,
        });
    }
};

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        if (password && password.length < 8) {
            return res.json({ error: 'Password is required and 8 character long' });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Merge address fields if address is provided
        let updatedAddress = user.address;
        if (address) {
            updatedAddress = {
                street: address.street ?? user.address?.street ?? "",
                state: address.state ?? user.address?.state ?? "",
                town: address.town ?? user.address?.town ?? "",
                pincode: address.pincode ?? user.address?.pincode ?? "",
            };
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: updatedAddress,
            },
            { new: true }
        );
        res.json({
            success: true,
            message: "Update profile successfully",
            updatedUser,
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "Error While Update Profile",
            error,
        });
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id })
            .populate("products.product")
            .populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error
        })
    }
}

// all oredrs
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate("products.product")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error
        })
    }
}

export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).populate("buyer", "name email");

        // Send email to customer if status is 'Shipped'
        if (status === "Shipped" && order && order.buyer && order.buyer.email) {
            try {
                await resend.emails.send({
                    from: "Henna Shop <onboarding@resend.dev>",
                    to: order.buyer.email,
                    subject: `Your Order #${order._id} Has Shipped!`,
                    html: `<h2>Your Order Has Shipped</h2>
                        <p>Hi ${order.buyer.name},</p>
                        <p>Your order <b>#${order._id}</b> has been shipped and is on its way!</p>
                        <p><b>Shipping Address:</b> ${order.shippingAddress}</p>
                        <p><b>Delivery Method:</b> ${order.deliveryMethod}</p>
                        <p><b>Delivery Fee:</b> ${order.deliveryFee}</p>
                        <p><b>Status:</b> Shipped</p>
                        <p>Thank you for shopping with us!</p>`
                });
            } catch (mailErr) {
                console.error("Failed to send shipped email to customer:", mailErr);
            }
        }

        res.json(order)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Updating Order Status",
            error
        })
    }
}

// test controller
export const testController = (req, res) => {
    res.send("Protected route")
}