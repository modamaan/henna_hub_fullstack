/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import {forgotPasswordController, loginController, registerController, testController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

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

export default router