
import { baseAPI } from "./baseAPI";
import { UNSUBSCRIBE } from "../constants/Actions";
interface subcribeData{
  channelID:string;
  action:"Subscribe" | "Unsubscribe";
}
const UserAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ username, email, password, fullName, avatar, coverImage }) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fullName", fullName);
        formData.append("avatar", avatar);
        formData.append("coverImage", coverImage);
        return {
          url: "/user/register",
          method: "POST",
          body: formData,
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/user/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["currentUser"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["currentUser"],
    }),

    googleSignIn: builder.mutation({
      query: (user) => ({
        url: "/user/google-sign-in",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["currentUser"],
    }),
    getCurrentUser: builder.query({
      query: () => `/user`,
      transformResponse: (res: any) => res.data,
      providesTags: ["currentUser"],
    }),
    getUserProfile: builder.query({
      query: (userID) => `user/${userID}/profile`,
      transformResponse: (res: any) => res.data,
      providesTags:["userProfile"]
    }),
    getSubscriptionDetails: builder.query({
      query: (userID) => `user/${userID}/subscription-detail`,
      transformResponse: (res: any) => res.data,
      providesTags:["subscriptionDetail"]
    }),
    // /:username/subscribtion-detail
    subscribe: builder.mutation({
      query: ({ channelID, action }:subcribeData) => ({
        url: `/subscribe/${channelID}`,
        method: `${action === UNSUBSCRIBE ? "DELETE" : "POST"}`,
      }),
      invalidatesTags:["userProfile","subscriptionDetail"]
    }),
    updateWatchHistory: builder.mutation({
      query: (videoID) => ({
        url: "/user/watch-history",
        method: "PATCH",
        body: { videoID: videoID },
      }),
      invalidatesTags: ["videoDetails"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGoogleSignInMutation,
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useSubscribeMutation,
  useGetSubscriptionDetailsQuery,
  useUpdateWatchHistoryMutation
} = UserAPI;
