import mongoose, { Schema } from "mongoose";
import { MONGODB_EXCLUDE, MONGODB_EXCLUDE_CREATE_UPDATE_DATE } from "../constants/selectExlusion.js";

const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      required:true,
      ref: "Video",
    },
    comment: {
      type: String,
      required:true,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      required:true,
      ref: "User",
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

commentSchema.pre("find", function (next) {
  this.populate({path:'commentedBy',select:`${MONGODB_EXCLUDE} -coverImage -watchHistory -email`})
  this.populate({ path: "replies", populate: { path: "commentedBy" ,select:`${MONGODB_EXCLUDE} -coverImage -watchHistory -email`} },);
  next();
});
export const Comment = mongoose.model("Comment", commentSchema);
