import { asyncHandler } from "../utils/asyncHandler";

const getServerHealth = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Server is up & running"));
});

export {getServerHealth};