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

    // 🔁 Resend Registration OTP
    resendRegistrationOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-registration-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // 🔐 Forgot Password (Send OTP)
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // ✅ Verify Reset Password OTP
    verifyResetOtp: builder.mutation({
      query: (otpData) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body: otpData, // { user_id, otp }
      }),
    }),

    //  Resend Reset OTP
    resendResetOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-reset-otp",
        method: "POST",
        body: { email },
      }),
    }),

    //  Reset Password
    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, otp, newPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOTPMutation,
  useResendRegistrationOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResendResetOtpMutation,
  useResetPasswordMutation,
} = authAPI;
