// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [
    "currentUser",
    "channelVideos",
    "userProfile",
    "videoDetails",
    "comments",
    "subscriptionDetail",
    "paginatedVideos",
    "watchHistory",
    "likedVideos",
    "subsAndSubsToDetails"
  ],
  endpoints: () => ({}),
});
