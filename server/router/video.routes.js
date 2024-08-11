import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, getChannelVideos, getPaginatedVideos, getRecommendationVideos, getVideoDetails, uploadVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/paginate").get(verifyJWT,getPaginatedVideos);
router.route("/:channel").get(verifyJWT,getChannelVideos);
router.route("/:currentVideoID/recommendations").get(verifyJWT,getRecommendationVideos);
router.route("/").get(verifyJWT,getAllVideos);
router.route("/").post(verifyJWT,upload.single("thumbnail"),uploadVideo);
router.route("/details/:videoID").get(verifyJWT,getVideoDetails);

export default router;