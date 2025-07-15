import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import { authHeaders } from "../lib/authHeaders";

export const periodDaysApi = createApi({
  reducerPath: "periodDaysApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  tagTypes: ["PeriodDays"],
  endpoints: (builder) => ({
    getPeriodDays: builder.query({
      query: ({ page = 1, limit = 1000, search = "" } = {}) => ({
        url: "/period-days",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "PeriodDays", id })),
              { type: "PeriodDays", id: "LIST" },
            ]
          : [{ type: "PeriodDays", id: "LIST" }],
    }),
    getPeriodDay: builder.query({
      query: (id) => ({
        url: `/period-days/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PeriodDays", id }],
    }),
    createPeriodDay: builder.mutation({
      query: (body) => ({
        url: "/period-days",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PeriodDays", id: "LIST" }],
    }),
    updatePeriodDay: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/period-days/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PeriodDays", id }],
    }),
    deletePeriodDay: builder.mutation({
      query: (id) => ({
        url: `/period-days/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "PeriodDays", id }],
    }),
    getTodayPeriodDay: builder.query({
      query: (userId) => ({
        url: "/period-days/today",
        method: "GET",
        params: { user_id: userId },
      }),
    }),
  }),
});

export const {
  useGetPeriodDaysQuery,
  useGetPeriodDayQuery,
  useCreatePeriodDayMutation,
  useUpdatePeriodDayMutation,
  useDeletePeriodDayMutation,
  useGetTodayPeriodDayQuery,
} = periodDaysApi;
