
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
      invalidatesTags:["userProfile","subscriptionDetail","subsAndSubsToDetails"]
    }),
    updateWatchHistory: builder.mutation({
      query: (videoID) => ({
        url: "/user/watch-history",
        method: "PATCH",
        body: { videoID: videoID },
      }),
      invalidatesTags: ["videoDetails","watchHistory"],
    }),
    refreshAccessToken:builder.mutation({
      query: () => ({
        url: "/user/refresh-access-token",
        method: "POST",
      }),
      invalidatesTags:["currentUser"]
    }),
    getWatchHistory:builder.query({
      query: () => `user/watch-history`,
      transformResponse: (res: any) => res.data,
      providesTags:["watchHistory"]
    }),
    getLikedVideos:builder.query({
      query: () => `user/liked`,
      transformResponse: (res: any) => res.data,
      providesTags:["likedVideos"]
    }),
    getSubscribersAndSubscriptionDetails:builder.query({
      query: () => `user/subscriber-details`,
      transformResponse: (res: any) => res.data,
      providesTags:["subsAndSubsToDetails"]
    }),
    getMessages: builder.query({
      queryFn: async () => ({data: null}),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        const evtSource = new EventSource(`/api/subscribe/stream`)
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            console.log("data",data);
            if (data === '') return;
            updateCachedData((draft) => {
              console.log("draft before",draft)
              draft=data;
              console.log("draft ater",draft)
            })
          }
          const onError = () => {
            evtSource.close();
        };

          evtSource.addEventListener('message', listener);
          evtSource.addEventListener('error', onError);
           // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        evtSource.close();
        } catch(e) {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
          console.error(e);
        }

      },
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
  useUpdateWatchHistoryMutation,
  useGetLikedVideosQuery,
  useGetWatchHistoryQuery,
  useGetSubscribersAndSubscriptionDetailsQuery,
  useRefreshAccessTokenMutation,
  useGetMessagesQuery
} = UserAPI;
