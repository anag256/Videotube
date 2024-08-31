import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { streamLogs } from "../controllers/stream.controller.js";

const router=Router();


router.route("/").get(verifyJWT,streamLogs);

export default router;