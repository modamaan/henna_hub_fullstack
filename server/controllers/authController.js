/* eslint-disable @typescript-eslint/no-unused-vars */

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

// test controller
export const testController = (req,res)=>{
    res.send("Protected route")
}