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
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]
    }
}, { timestamps: true })
export default mongoose.model("Order", orderSchema)