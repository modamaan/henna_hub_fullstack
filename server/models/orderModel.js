import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    products: [{
        product: {
            type: mongoose.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    shippingAddress: {
        type: String, // Formatted from address object (street, state, town, pincode) or pickup note
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ["DTDC", "POSTAL"],
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]
    }
}, { timestamps: true })
export default mongoose.model("Order", orderSchema)