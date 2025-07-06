import testimonialModel from "../models/testimonialModel.js";
import cloudinary from "../config/cloudinary.js";

// Create testimonial
export const createTestimonialController = async (req, res) => {
    try {
        const { name, location, rating, text } = req.fields;
        const { hennaImage } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is required" });
            case !location:
                return res.status(400).send({ error: "Location is required" });
            case !rating:
                return res.status(400).send({ error: "Rating is required" });
            case rating < 1 || rating > 5:
                return res.status(400).send({ error: "Rating must be between 1 and 5" });
            case !text:
                return res.status(400).send({ error: "Text is required" });
            case !hennaImage:
                return res.status(400).send({ error: "Henna image is required" });
            case hennaImage.size > 10 * 1024 * 1024:
                return res.status(400).send({
                    error: "Image should be less than 10 MB",
                });
        }

        let imageUrl = "";
        if (hennaImage) {
            const result = await cloudinary.uploader.upload(hennaImage.path, {
                folder: "testimonials",
                resource_type: "image"
            });
            imageUrl = result.secure_url;
        }

        const testimonial = new testimonialModel({
            name,
            location,
            rating,
            text,
            hennaImage: imageUrl
        });

        await testimonial.save();
        res.status(201).send({
            success: true,
            message: "Testimonial submitted successfully! It will be reviewed and approved soon.",
            testimonial,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating testimonial",
        });
    }
};

// Get all testimonials (admin only)
export const getAllTestimonialsController = async (req, res) => {
    try {
        const testimonials = await testimonialModel
            .find({})
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: testimonials.length,
            message: "All Testimonials",
            testimonials,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting testimonials",
            error: error.message,
        });
    }
};

// Get approved testimonials (public)
export const getApprovedTestimonialsController = async (req, res) => {
    try {
        const testimonials = await testimonialModel
            .find({ isApproved: true })
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: testimonials.length,
            message: "Approved Testimonials",
            testimonials,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting approved testimonials",
            error: error.message,
        });
    }
};

// Approve testimonial (admin only)
export const approveTestimonialController = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await testimonialModel.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        );
        
        if (!testimonial) {
            return res.status(404).send({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Testimonial approved successfully",
            testimonial,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in approving testimonial",
            error: error.message,
        });
    }
};

// Delete testimonial (admin only)
export const deleteTestimonialController = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await testimonialModel.findByIdAndDelete(id);
        
        if (!testimonial) {
            return res.status(404).send({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Testimonial deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting testimonial",
            error: error.message,
        });
    }
}; 