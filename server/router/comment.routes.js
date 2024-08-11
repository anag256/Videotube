import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, getComments, removeComment } from "../controllers/comment.controller.js";

const router=Router();


router.route("/").post(verifyJWT,addComment);

router.route("/:videoID").get(verifyJWT,getComments);
router.route("/").delete(verifyJWT,removeComment);
export default router;