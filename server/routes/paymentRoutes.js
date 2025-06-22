import express from 'express'
import { createOrder, verifyPayment } from "../controllers/paymentController.js"
import { requireSignIn } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/create-order", requireSignIn, createOrder);
router.post("/verify-payment", verifyPayment);

export default router
