import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getServerHealth = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Server is up & running"));
});

export { getServerHealth };
