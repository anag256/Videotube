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
app.use(express.static("files"));
app.use(cookieParser());

import userRouter from "./router/user.routes.js";
import subscriptionRouter from "./router/subscription.routes.js";
import videoRouter from "./router/video.routes.js";

app.use("/user", userRouter);
app.use("/subscribe", subscriptionRouter);
app.use("/video",videoRouter);

export { app };