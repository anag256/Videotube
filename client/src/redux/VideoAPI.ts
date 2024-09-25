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
      providesTags: ["channelVideos"],
    }),
    getPaginatedVideos: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `video/paginate?page=${page}&limit=${limit}`,
      keepUnusedDataFor: 0,
      transformResponse: (res: any) => res.data,
      providesTags: ["paginatedVideos"],
    }),
    getVideoDetails: builder.query({
      query: (videoID) => `/video/details/${videoID}`,
      transformResponse: (res: any) => res.data,
      providesTags: ["videoDetails"],
    }),
    // /reactions/:videoID
    getVideoReactions: builder.query({
      query: (videoID) => `/video/reactions/${videoID}`,
      transformResponse: (res: any) => res.data,
    }),
    toggleLikes: builder.mutation({
      query: (videoID) => ({
        url: "/video/like",
        method: "POST",
        body: { videoId: videoID },
      }),
      invalidatesTags: ["likedVideos"],
      async onQueryStarted(videoID, { dispatch, queryFulfilled }) {
        console.log("in onquery", videoID);
        const patchResult = dispatch(
          VideoAPI.util.updateQueryData(
            "getVideoReactions",
            videoID,
            (draft) => {
              console.log("draft in", draft);
              draft = draft.isLiked
                ? { ...draft, totalLikes: draft.totalLikes - 1, isLiked: false }
                : {
                    ...draft,
                    totalLikes: draft.totalLikes + 1,
                    isLiked: true,
                    totalDislikes: draft.isDisliked
                      ? draft.totalDislikes - 1
                      : draft.totalDislikes,
                    isDisliked: false,
                  };
              return draft;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
    }),
    toggleDislikes: builder.mutation({
      query: (videoID) => ({
        url: "/video/dislike",
        method: "POST",
        body: { videoId: videoID },
      }),
      invalidatesTags: ["likedVideos"],
      async onQueryStarted(videoID, { dispatch, queryFulfilled }) {
        console.log("in onquery", videoID);
        const patchResult = dispatch(
          VideoAPI.util.updateQueryData(
            "getVideoReactions",
            videoID,
            (draft) => {
              console.log("draft in", draft);
              draft = draft.isDisliked
                ? {
                    ...draft,
                    totalDislikes: draft.totalDislikes - 1,
                    isDisliked: false,
                  }
                : {
                    ...draft,
                    totalDislikes: draft.totalDislikes + 1,
                    isDisliked: true,
                    totalLikes: draft.isLiked
                      ? draft.totalLikes - 1
                      : draft.totalLikes,
                    isLiked: false,
                  };

              return draft;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
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
      invalidatesTags: ["channelVideos", "paginatedVideos"],
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
  useGetVideoReactionsQuery,
  useToggleLikesMutation,
  useToggleDislikesMutation,
} = VideoAPI;
