import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changePassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, updateWatchHistory } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);
//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/change-password").post(verifyJWT,changePassword);
router.route("/").get(verifyJWT,getCurrentUser);
router.route("/account-details").patch(verifyJWT,updateAccountDetails);
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage);
router.route("/watch-history").patch(verifyJWT,updateWatchHistory);
router.route("/watch-history").get(verifyJWT,getUserWatchHistory);
router.route("/:username/profile").get(verifyJWT,getUserChannelProfile);
export default router;
