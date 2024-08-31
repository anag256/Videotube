import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { subscribeChannel, unsubscribeChannel } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/:channel").post(verifyJWT,subscribeChannel);
router.route("/:channel").delete(verifyJWT,unsubscribeChannel);

export default router;