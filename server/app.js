import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("./files"));
app.use(cookieParser());

import userRouter from "./router/user.routes.js";
import subscriptionRouter from "./router/subscription.routes.js";
import videoRouter from "./router/video.routes.js";
import commentRouter from "./router/comment.routes.js";
import likesRouter from "./router/like.route.js";
import dislikesRouter from "./router/dislike.route.js";
import streamRouter from "./router/stream.routes.js";
import { getServerHealth } from "./controllers/util.controller.js";

app.get("/health-check",getServerHealth);
app.use("/user", userRouter);
app.use("/subscribe", subscriptionRouter);
app.use("/stream", streamRouter);
app.use("/video",videoRouter);
app.use("/comment",commentRouter);
app.use("/video/like",likesRouter);
app.use("/video/dislike",dislikesRouter);

export { app };
