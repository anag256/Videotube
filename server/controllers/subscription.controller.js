import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const subscribeChannel = asyncHandler(async (req, res, next) => {
    const subscribeTo = req.params.channel;
    const subscriber = req.user;
    const existingSubscription=await Subscription.findOne({
        subscriber:subscriber,
        channel:subscribeTo
    });
    if(existingSubscription) throw new ApiError(409,"User is already subscribed to the channel")
    const subscription = await Subscription.create({
      subscriber: new mongoose.Types.ObjectId(subscriber?._id),
      channel: new mongoose.Types.ObjectId(subscribeTo),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, subscription, "Channel Subscribed successfully")
      );
  });

  const unsubscribeChannel = asyncHandler(async (req, res, next) => {
    const channel = req.params.channel;
    const subscriber = req.user;
    const existingSubscription=await Subscription.findOne({
        subscriber:subscriber,
        channel:channel
    });
    if(!existingSubscription) throw new ApiError(409,"User is not subscribed to the channel")
    const subscription = await Subscription.deleteOne({
      subscriber: new mongoose.Types.ObjectId(subscriber?._id),
      channel: new mongoose.Types.ObjectId(channel),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, subscription, "Channel Unsubscribed successfully")
      );
  });
  export {subscribeChannel,unsubscribeChannel};