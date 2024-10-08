import mongoose, { Schema } from "mongoose";

const dislikeSchema=new Schema({
    dislikedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true});

export const Dislike=mongoose.model("Dislike",dislikeSchema);