import mongoose, { Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  MONGODB_EXCLUDE,
  MONGODB_EXCLUDE_PWD_REFRESHTOKEN,
} from "../constants/selectExlusion.js";

const incrementVideoViews = async (videoId) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });
    return updatedVideo;
  } catch (err) {
    console.error(err);
  }
};
const uploadVideo = asyncHandler(async (req, res, next) => {
  const { title, description, isPublished, videoPath } = req.body;
  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video = await Video.create({
    title,
    description,
    isPublished,
    videoFile: videoPath,
    thumbnail: thumbnail?.url,
    owner: req.user?._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video Uploaded successfully"));
});

const getChannelVideos = asyncHandler(async (req, res, next) => {
  const { channel } = req.params;
  console.log("channel", channel);
  const videos = await Video.find({
    owner: channel,
  }).select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
  if (!videos || videos.length === 0)
    throw new ApiError(404, "The channel does not have any videos");
  return res
    .status(200)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find().select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
  if (!videos) throw new ApiError(404, "No videos available");
  return res
    .status(200)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const getRecommendationVideos = asyncHandler(async (req, res, next) => {
  const { currentVideoID } = req.params;
  const videos = await Video.find({
    _id: { $ne: currentVideoID },
  })
    .populate({ path: "owner", select: MONGODB_EXCLUDE })
    .limit(10)
    .select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
  if (!videos || videos.length === 0)
    throw new ApiError(404, "No videos available");
  return res
    .status(200)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const getPaginatedVideos = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  console.log(page, limit);
  const skip = (page - 1) * limit;
  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid page or limit value"));
  }
  const videos = await Video.find().populate({ path: "owner", select: MONGODB_EXCLUDE })
    .skip(skip)
    .limit(limit)
    .select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
  const totalVideos = await Video.countDocuments();
  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      totalVideos: totalVideos,
      currentPage: page,
      limit: limit,
      totalPage: Math.ceil(totalVideos / limit),
    })
  );
});

const getVideoDetails = asyncHandler(async (req, res, next) => {
  const { videoID } = req.params;
  console.log("videoid", videoID);
  const video = await Video.findById(videoID).populate({
    path: "owner",
    select: MONGODB_EXCLUDE,
  });
  // const videoDetails = await Video.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(videoID),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "likes",
  //       localField: "_id",
  //       foreignField: "video",
  //       as: "likedBy",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "dislikes",
  //       localField: "_id",
  //       foreignField: "video",
  //       as: "dislikedBy",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "owner",
  //       foreignField: "_id",
  //       as: "owner",
  //       pipeline: [
  //         {
  //           $project: {
  //             username: 1,
  //             avatar: 1,
  //             coverImage: 1,
  //             fullName: 1,
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $addFields: {
  //       totalLikes: {
  //         $size: "$likedBy",
  //       },
  //       totalDislikes: {
  //         $size: "$dislikedBy",
  //       },
  //       owner: {
  //         $first: "$owner",
  //       },
  //     },
  //   },
  // ]);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const getVideoLikesDislikes = asyncHandler(async (req, res, next) => {
  const { videoID } = req.params;
  const videoReactions = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoID),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedBy",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "video",
        as: "dislikedBy",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: "$likedBy",
        },
        totalDislikes: {
          $size: "$dislikedBy",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$likedBy.likedBy",
              ],
            },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$dislikedBy.dislikedBy",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videoReactions[0],
        "Video Reactions fetched successfully"
      )
    );
});

export {
  uploadVideo,
  getChannelVideos,
  getAllVideos,
  getRecommendationVideos,
  getPaginatedVideos,
  incrementVideoViews,
  getVideoDetails,
  getVideoLikesDislikes
};
