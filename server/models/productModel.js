import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
    },
    photo: {
        type: String, // Cloudinary image URL
        required: true
    },
    shipping: {
        type: String
    },
    offer: {
        type: Number
    }
}, { timestamps: true })
export default mongoose.model("Product", productSchema)