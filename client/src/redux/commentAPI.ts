import { baseAPI } from './baseAPI';

const commentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
        query: (comment) => ({
          url: "/comment",
          method: "POST",
          body: comment,
        }),
      }),
      getComment: builder.query({
        query: () => `/comment/`,
      }),
  }),
  overrideExisting: false,
})

export const { useAddCommentMutation,useGetCommentQuery } = commentAPI