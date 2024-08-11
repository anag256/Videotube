import { baseAPI } from "./baseAPI";

const VideoAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllVideos: builder.query({
      query: () => `/video/`,
    }),
    getRecommendedVideos: builder.query({
      query: (videoID) => `/video/${videoID}/recommendations`,
    }),
    getChannelVideos: builder.query({
      query: (channelID) => `/video/${channelID}`,
    }),
    getPaginatedVideos: builder.query({
      query: (page = 1, limit = 10) =>
        `video/paginate?page=${page}&limit=${limit}`,
    }),
    getVideoDetails: builder.query({
      query: (videoID) => `/video/details/${videoID}`,
    }),
    uploadVideo: builder.mutation({
      query: ({ title, description, isPublished, videoPath, thumbnail }) => {
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("isPublished", isPublished);
        formData.append("videoPath", videoPath);
        return {
          url: `/video/`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllVideosQuery,
  useGetPaginatedVideosQuery,
  useGetRecommendedVideosQuery,
  useGetChannelVideosQuery,
  useGetVideoDetailsQuery,
  useUploadVideoMutation,
} = VideoAPI;
