import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { pub, sub } from "../redis/index.js";

const subscribeChannel = asyncHandler(async (req, res, next) => {
    const subscribeTo = req.params.channel;
    const subscriber = req.user;
    if(subscribeTo===subscriber) throw new ApiError(403,"User cannot subscribe to your own channel")
    const existingSubscription=await Subscription.findOne({
        subscriber:subscriber,
        channel:subscribeTo
    });
    if(existingSubscription) throw new ApiError(409,"User is already subscribed to the channel")
    const subscription = await Subscription.create({
      subscriber: new mongoose.Types.ObjectId(subscriber?._id),
      channel: new mongoose.Types.ObjectId(subscribeTo),
    });
    await pub.publish(`MESSAGES-${req.params.channel}`, JSON.stringify({ message:`${req?.user?.username} subscribed to your channel` }));
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

  const streamLogs=async (req,res)=>{
    console.log("in stream logs");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send an initial message
    sendEvent(res, "CONNECTION ESTABLISHED");

    // Subscribe to the Redis channel
    const redisChannel = `MESSAGES-${req.user?._id}`;
    console.log("redisChannel",redisChannel);
    await sub.subscribe(redisChannel);

    // Handle incoming messages from Redis
    const handleMessage = (channel, message) => {
      console.log("in handle message",channel,message)
        if (channel === redisChannel) {
            console.log("new message from redis", message, channel);
            sendEvent(res, message);
        }
    };

    sub.on("message", handleMessage);

    // Clean up on client disconnect
    req.on('close', async() => {
        console.log('Client disconnected');
        sub.unsubscribe(redisChannel);
        sub.off("message", handleMessage);
    });
  }

  function sendEvent(res,message){
    console.log("writing response:","data:"+`${message}\n\n`)
    res.write("data:"+`${message}\n\n`);
  }
  export {subscribeChannel,unsubscribeChannel,streamLogs};