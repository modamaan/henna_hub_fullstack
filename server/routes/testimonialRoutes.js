import express from "express";
import formidable from "express-formidable";
import {
    createTestimonialController,
    getAllTestimonialsController,
    getApprovedTestimonialsController,
    approveTestimonialController,
    deleteTestimonialController
} from "../controllers/testimonialController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create testimonial (public)
router.post("/create", formidable(), createTestimonialController);

// Get approved testimonials (public)
router.get("/approved", getApprovedTestimonialsController);

// Admin routes
// Get all testimonials
router.get("/all", requireSignIn, isAdmin, getAllTestimonialsController);

// Approve testimonial
router.put("/approve/:id", requireSignIn, isAdmin, approveTestimonialController);

// Delete testimonial
router.delete("/delete/:id", requireSignIn, isAdmin, deleteTestimonialController);

export default router; 