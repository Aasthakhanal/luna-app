import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import Cookies from "js-cookie";
import { authHeaders } from "../lib/authHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: authHeaders,
});

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (OTPCode) => ({
        url: `/auth/verifyOtp`,
        method: "POST",
        OTPCode,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useVerifyOTPMutation } =
  authAPI;
