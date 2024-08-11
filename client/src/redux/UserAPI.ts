import { baseAPI } from "./baseAPI";

const UserAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({  username, email, password, fullName,avatar,coverImage }) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email",email);
        formData.append("password",password);
        formData.append("fullName",fullName);
        formData.append("avatar",avatar);
        formData.append("coverImage",coverImage);
        return {
        url: "/user/register",
        method: "POST",
        body: formData,
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
    }),

    googleSignIn: builder.mutation({
      query: (user) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => `/user/`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGoogleSignInMutation,
  useGetCurrentUserQuery
} = UserAPI;
