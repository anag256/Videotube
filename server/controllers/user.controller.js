import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { incrementVideoViews } from "./video.controller.js";
import mongoose from "mongoose";
import {
  DEFAULT_COVER_IMAGE,
  JWT_TOKEN_OPTIONS,
} from "../constants/userConstants.js";
import path from "path";
import { MONGODB_EXCLUDE } from "../constants/selectExlusion.js";
import fs from "fs";
const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //so that password etc doesnot kick in as it has not been changed
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access & refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  //1) check if any field is empty
  //2) check if the user already exists
  const { username, email, password, fullName } = req.body;
  if (
    [username, email, password, fullName].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ email, username }],
  });

  if (existingUser) throw new ApiError(409, "User already exists");

  let isFilesEmpty = Object.keys(req?.files).length === 0;

  if (isFilesEmpty) {
    fs.copyFileSync("./files/defaults/man.png", "./files/images/man.png");
    fs.copyFileSync("./files/defaults/bg.jpeg", "./files/images/bg.jpeg");
  }

  const avatarLocalPath = !isFilesEmpty
    ? req.files?.avatar[0]?.path
    : "./files/images/man.png";

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const coverImageLocalPath = !isFilesEmpty
    ? req.files?.coverImage[0]?.path
    : "./files/images/bg.jpeg";

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar || !coverImage)
    throw new ApiError("avatar or coverImage upload failed");
  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url,
    refreshToken: "",
    watchHistory: [],
  });
  const createdUser = await User.findById(user._id).select(MONGODB_EXCLUDE);
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }
  const user = await User.findOne({
    username,
  });
  if (!user)
    throw new ApiError(
      404,
      "User does not exist. Please create an Account with Videotube"
    );
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(404, "Invalid user credentials");
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);
  const loggedInUser = await User.findById(user._id).select(MONGODB_EXCLUDE);
  return res
    .status(200)
    .cookie("accessToken", accessToken, JWT_TOKEN_OPTIONS)
    .cookie("refreshToken", refreshToken, JWT_TOKEN_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "Logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", JWT_TOKEN_OPTIONS)
    .clearCookie("refreshToken", JWT_TOKEN_OPTIONS)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?._id);
  if (!user) throw new ApiError(400, "Invalid refresh token");
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);
  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(400, "Invalid Password");
  if (newPassword === oldPassword)
    throw new ApiError(400, "Entered password same as old password");
  user.password = newPassword;
  const changedUser = await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, changedUser, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;
  if (!fullName && !email) throw new ApiError(400, "All field are required");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select(MONGODB_EXCLUDE);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url)
    throw new ApiError(
      500,
      "Something went wrong while uploading on cloudinary"
    );
  const modifiedUser = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select(MONGODB_EXCLUDE);
  return res
    .status(200)
    .json(new ApiResponse(200, modifiedUser, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) throw new ApiError(400, "cover Image is required");
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url)
    throw new ApiError(
      500,
      "Something went wrong while uploading on cloudinary"
    );
  const modifiedUser = await User.findByIdAndUpdate(
    req?.user._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select(MONGODB_EXCLUDE);
  return res
    .status(200)
    .json(
      new ApiResponse(200, modifiedUser, "coverImage updated successfully")
    );
});

const updateWatchHistory = asyncHandler(async (req, res, next) => {
  const { videoID } = req.body;
  if (!videoID)
    throw new ApiError(400, "VideoID is required for updating watch History");
  const userWithExistingView = await User.findOne({
    $and: [{ _id: req.user?._id }, { watchHistory: videoID }],
  });

  if (userWithExistingView)
    throw new ApiError(409, "User has already viewed the video");

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $push: {
        watchHistory: videoID,
      },
    },
    { new: true }
  ).select(MONGODB_EXCLUDE);
  const updatedVideo = await incrementVideoViews(videoID);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: updatedUser,
      },
      "watchHistory updated successfully"
    )
  );
});

const getUserChannelProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "Channel does not exist");
  const userProfile = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "SubscribedTo",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "Subscribers",
      },
    },
    {
      $addFields: {
        SubscribersCount: {
          $size: "$Subscribers",
        },
        SubscribedToCount: {
          $size: "$SubscribedTo",
        },
        isSubscribedTo: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$Subscribers.subscriber",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userProfile[0], "User Profile fetched successfully")
    );
});

const getUserWatchHistory = asyncHandler(async (req, res, next) => {
  const watchHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistoryData",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    password: 0,
                    refreshToken: 0,
                    coverImage: 0,
                    thumbnail: 0,
                    email: 0,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        email: 1,
        username: 1,
        fullName: 1,
        watchHistoryData: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, watchHistory[0], "Watch History fetched successfully")
    );
});

const googleSignIn = asyncHandler(async (req, res, next) => {
  const { email, displayName, emailVerified, photoURL } = req.body;
  if (!emailVerified)
    throw new ApiError(400, "Email not verified via google sign in");
  let user = await User.findOne({ email });
  if (!user) {
    const generatedUsername = displayName.toLowerCase().replace(/\s+/g, "");
    const generatedPassword = Math.random().toString(36).slice(-8);
    user = await User.create({
      username: generatedUsername,
      password: generatedPassword,
      email,
      fullName: displayName,
      avatar: photoURL,
      coverImage: DEFAULT_COVER_IMAGE,
      refreshToken: "",
      watchHistory: [],
    });
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const loggedInUser = await User.findById(user._id).select(MONGODB_EXCLUDE);
  return res
    .status(200)
    .cookie("accessToken", accessToken, JWT_TOKEN_OPTIONS)
    .cookie("refreshToken", refreshToken, JWT_TOKEN_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "Logged in successfully"
      )
    );
});

const getSubscribersAndSubscriptions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subscriptionDetails = await User.aggregate([
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $project: {
        subscribers: 1,
        subscribedTo: 1,
      },
    },
    {
      $addFields: {
        SubscribersCount: {
          $size: "$subscribers",
        },
        SubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribedTo: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$subscribers.subscriber",
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
        subscriptionDetails[0],
        "subscription details fetched successfully"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res, next) => {
  const likedVideos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req?.user._id),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedBy",
        as: "likedVideosData",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "likedVideosData.video",
        foreignField: "_id",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    fullName: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        fullName: 1,
        likedVideos: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos[0], "Liked Videos fetched successfully")
    );
});

const getSubscribersAndSubscriptionsDetails = asyncHandler(
  async (req, res, next) => {
    const subscriptions = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req?.user._id),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscribers.subscriber",
          foreignField: "_id",
          as: "subscribers",
        },

      },

      {
        $lookup: {
          from: "users",
          localField: "subscribedTo.channel",
          foreignField: "_id",
          as: "subscribedTo",
        },
      },
      {
        $project: {
          "subscribers._id": 1,
          "subscribers.fullName": 1,
          "subscribers.avatar": 1,
          "subscribers.username": 1,
          "subscribedTo._id": 1,
          "subscribedTo.fullName": 1,
          "subscribedTo.avatar": 1,
          "subscribedTo.username": 1,
          username: 1,
          avatar: 1,
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscriptions[0],
          "Subscription details fetched successfully"
        )
      );
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  updateWatchHistory,
  getUserWatchHistory,
  getUserChannelProfile,
  googleSignIn,
  getSubscribersAndSubscriptions,
  getLikedVideos,
  getSubscribersAndSubscriptionsDetails,
};
