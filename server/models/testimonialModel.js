import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    hennaImage: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema); 