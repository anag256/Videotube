import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ");
        if(!token) throw new ApiError(401,"UnAuthorized API request");
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user) throw new ApiError(404,"Invalid access token");
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message)
    }

})

export {verifyJWT};