import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { streamLogs, subscribeChannel, unsubscribeChannel } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/:channel").post(verifyJWT,subscribeChannel);
router.route("/:channel").delete(verifyJWT,unsubscribeChannel);
router.route("/stream").get(verifyJWT,streamLogs);

export default router;