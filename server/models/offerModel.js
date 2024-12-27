import mongoose from 'mongoose';

const offerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    count:{
        type:Number,
    },
    photo:{
        data: Buffer,
        contentType: String,
    },
    shipping:{
        type:String
    },
    offer:{
        type:Number,
        required:true
    }
},{timestamps:true})
export default mongoose.model("Offer", offerSchema)