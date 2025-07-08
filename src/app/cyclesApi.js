import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import { authHeaders } from "../lib/authHeaders";

export const cyclesApi = createApi({
  reducerPath: "cyclesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  tagTypes: ["cycles"],
  endpoints: (builder) => ({
    getCycles: builder.query({
      query: ({ limit = 10, page = 1 }) => ({
        url: "/cycles",
        method: "GET",
        params: { limit, page },
      }),
      providesTags: ["cycles"],
    }),

    findCycle: builder.query({
      query: (id) => `/cycles/${id}`,
      providesTags: ["cycles"],
    }),

    createCycle: builder.mutation({
      query: (body) => ({
        url: "/cycles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cycles"],
    }),

    updateCycle: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/cycles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["cycles"],
    }),

    deleteCycle: builder.mutation({
      query: (id) => ({
        url: `/cycles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cycles"],
    }),
  }),
});

export const {
  useGetCyclesQuery,
  useFindCycleQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
  useLazyGetCyclesQuery,
} = cyclesApi;
