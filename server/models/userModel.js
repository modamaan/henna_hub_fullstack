import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
    },
    address:{
        street: { type: String, required: true },
        state: { type: String, required: true },
        town: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    recoveryId:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
},{timestamps:true})

export default mongoose.model("User",userSchema)