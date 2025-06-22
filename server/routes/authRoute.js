/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import {forgotPasswordController, loginController, registerController, testController,updateProfileController,getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { updateCategoryController } from '../controllers/categoryController.js'

const router = express.Router()

// registration
router.post('/register', registerController)

//login
router.post('/login',loginController)

// forgot password
router.post('/forgot-password',forgotPasswordController)

// test
// router.get('/test',requireSignIn,testController)

// protected route
router.get("/user-auth", requireSignIn, (req,res)=>{
    res.status(200).send({ok: true})
})
// admin route
router.get("/admin-auth", requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok: true})
})
// update profile
router.put('/profile', requireSignIn, updateProfileController)

// orders
router.get('/orders', requireSignIn, getOrdersController)

// all orders
router.get('/all-orders', requireSignIn,isAdmin,getAllOrdersController)

// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin,orderStatusController)

export default router