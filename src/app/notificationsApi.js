import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import { authHeaders } from "../lib/authHeaders";

export const notificationsAPI = createApi({
  reducerPath: "notificationsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  tagTypes: ["notifications"],
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 10, search, user_id }) => ({
        url: `/notifications`,
        method: "GET",
        params: { page, limit, search, user_id },
      }),
      providesTags: () => ["notifications"],
    }),
    getUserNotifications: builder.query({
      query: ({ page = 1, limit = 10, search }) => ({
        url: `/notifications`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: () => ["notifications"],
    }),
    findNotification: builder.query({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
      providesTags: () => ["notifications"],
    }),
    sendNotification: builder.mutation({
      query: (body) => ({
        url: `/notifications`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
    updateNotification: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body: { read: true },
      }),
      invalidatesTags: ["notifications"],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
    userDailyCheck: builder.mutation({
      query: () => ({
        url: `/notifications/user-daily-check`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetUserNotificationsQuery,
  useFindNotificationQuery,
  useSendNotificationMutation,
  useUpdateNotificationMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useUserDailyCheckMutation,
} = notificationsAPI;
