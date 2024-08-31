import { sub } from "../redis/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const streamLogs = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial message
  sendEvent(res, "CONNECTION ESTABLISHED");

  // Subscribe to the Redis channel
  const redisChannel = `MESSAGES-${req.user?._id}`;
  await sub.subscribe(redisChannel);

  // Handle incoming messages from Redis
  const handleMessage = (channel, message) => {
    if (channel === redisChannel) {
      sendEvent(res, message);
    }
  };

  sub.on("message", handleMessage);

  // Clean up on client disconnect
  req.on("close", async () => {
    console.log("Client disconnected");
    sub.unsubscribe(redisChannel);
    sub.off("message", handleMessage);
  });
});
function sendEvent(res, message) {
  console.log("writing response:", "data:" + `${message}\n\n`);
  res.write("data:" + `${message}\n\n`);
}

export { streamLogs };
