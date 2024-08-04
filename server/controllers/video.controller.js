import mongoose, { Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { MONGODB_EXCLUDE, MONGODB_EXCLUDE_PWD_REFRESHTOKEN } from "../constants/selectExlusion.js";

const incrementVideoViews=asyncHandler(async(videoId)=>{
  const updatedVideo=await Video.findByIdAndUpdate(videoId,{ $inc: { views: 1 } });
  return updatedVideo;
})
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
  const videos = await Video.find().select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);;
  if (!videos) throw new ApiError(404, "No videos available");
  return res
    .status(200)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const getRecommendationVideos = asyncHandler(async (req, res, next) => {
  const { currentVideoID } = req.params;
  const videos = await Video.find({
    _id: { $ne: currentVideoID },
  }).limit(10).select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
  if (!videos || videos.length === 0)
    throw new ApiError(404, "No videos available");
  return res
    .status(200)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const getPaginatedVideos = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  console.log(page,limit)
  const skip = (page - 1) * limit;
  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid page or limit value"));
  }
  const videos = await Video.find().skip(skip).limit(limit).select(MONGODB_EXCLUDE_PWD_REFRESHTOKEN);
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

const getVideoDetails=asyncHandler(async(req,res,next)=>{
  const {videoID}=req.params;
  console.log("videoid",videoID)
 const video= await Video.findById(videoID).populate({
  path:"owner",
  select:MONGODB_EXCLUDE
 });

 return res.status(200).json(new ApiResponse(200,video,"Video fetched successfully"))
})

export {
  uploadVideo,
  getChannelVideos,
  getAllVideos,
  getRecommendationVideos,
  getPaginatedVideos,
  incrementVideoViews,
  getVideoDetails
};
