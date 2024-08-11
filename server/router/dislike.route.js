import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleDislike } from "../controllers/dislike.controller.js";

const router = Router();
router.route("/").post(verifyJWT, toggleDislike);
export default router;
