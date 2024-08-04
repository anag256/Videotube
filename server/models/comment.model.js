import mongoose, { Schema } from "mongoose";

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
  this.populate({ path: "replies", populate: { path: "commentedBy" } });
  next();
});
export const Comment = mongoose.model("Comment", commentSchema);
