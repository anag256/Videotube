import { Dislike } from "../models/dislikes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeLikeIfExists } from "./like.controller.js";

const removeDislikeIfExists = async (userId, videoId) => {
  try {
    const existingDislike = await Dislike.findOne({
      dislikedBy: userId,
      video: videoId,
    });
    if (!existingDislike) {
      return false;
    }
    return await Dislike.deleteOne({ _id: existingDislike._id });
  } catch (err) {
    console.error(err);
  }
};
const toggleDislike = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;
  const removeExistingDislike = await removeDislikeIfExists(
    req.user?._id,
    videoId
  );
  if (removeExistingDislike) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Dislike removed successfully."));
  }
  const newDislike = await Dislike.create({
    dislikedBy: req.user?._id,
    video: videoId,
  });
  await removeLikeIfExists(req.user?._id, videoId);
  const dislike = await Dislike.findById(newDislike._id);

  return res
    .status(201)
    .json(new ApiResponse(201, dislike, "Dislike updated successfully"));
});

export { toggleDislike, removeDislikeIfExists };
