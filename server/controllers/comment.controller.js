import { MONGODB_EXCLUDE_CREATE_UPDATE_DATE } from "../constants/selectExlusion.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res, next) => {
  const { comment, commentedBy, parentComment = null, videoId } = req.body;

  const newComment = await Comment.create({
    comment,
    commentedBy,
    parentComment,
    video: videoId,
  });

  if (parentComment) {
    const reply = await Comment.findByIdAndUpdate(parentComment, {
      $push: { replies: newComment._id },
    });
  }
  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const getComments = asyncHandler(async (req, res, next) => {
  const { videoID } = req.params;
  const comments = await Comment.find({ video: videoID,parentComment:null }).sort('-createdAt');
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const removeComment = asyncHandler(async (req, res, next) => {
  const { commentID } = req.body;
  async function deleteComment(id) {
    const comment = await Comment.findById(id);
    for (let replyId of comment?.replies) {
      deleteComment(replyId);
    }
    await Comment.findByIdAndDelete(id);
  }

  await deleteComment(commentID);
  await Comment.findOneAndUpdate({
    replies:commentID
  },{$pull:{replies:commentID}})
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});
export { addComment, getComments, removeComment };
