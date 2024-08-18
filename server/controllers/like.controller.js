import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeDislikeIfExists } from "./dislike.controller.js";

const removeLikeIfExists = async (userId, videoId) => {
  try {
    const existingLike = await Like.findOne({
      likedBy: userId,
      video: videoId,
    });
    if (!existingLike) {
      return false;
    }
    return await Like.deleteOne({ _id: existingLike._id });
  } catch (err) {
    console.error(err);
  }
};

const toggleLike = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;
  console.log("videoID in toggleLike",videoId)
  const removeExistingLike = await removeLikeIfExists(req.user?._id, videoId);

  if (removeExistingLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully."));
  }

  const newLike = await Like.create({
    likedBy: req.user?._id,
    video: videoId,
  });
  await removeDislikeIfExists(req.user?._id, videoId);
  const like = await Like.findById(newLike._id);
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Like updated successfully"));
});

export { toggleLike, removeLikeIfExists };
