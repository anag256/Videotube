import { baseAPI } from './baseAPI';

const commentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
        query: (comment) => ({
          url: "/comment",
          method: "POST",
          body: comment,
        }),
        invalidatesTags:["comments"]
      }),
      getComments: builder.query({
        query: (videoID) => `/comment/${videoID}`,
        transformResponse: (res: any) => res.data,
        providesTags:["comments"]
      }),
  }),
  overrideExisting: false,
})

export const { useAddCommentMutation,useGetCommentsQuery } = commentAPI