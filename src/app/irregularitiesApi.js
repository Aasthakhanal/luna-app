import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import { authHeaders } from "../lib/authHeaders";

export const irregularitiesApi = createApi({
  reducerPath: "irregularitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  tagTypes: ["irregularities"],
  endpoints: (builder) => ({
    getIrregularities: builder.query({
      query: ({ limit = 10, page = 1 }) => ({
        url: "/irregularities",
        method: "GET",
        params: { limit, page },
      }),
      providesTags: ["irregularities"],
    }),

    findIrregularity: builder.query({
      query: (id) => `/irregularities/${id}`,
      providesTags: ["irregularities"],
    }),

    createIrregularity: builder.mutation({
      query: (body) => ({
        url: "/irregularities",
        method: "POST",
        body,
      }),
      invalidatesTags: ["irregularities"],
    }),

    updateIrregularity: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/irregularities/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["irregularities"],
    }),

    deleteIrregularity: builder.mutation({
      query: (id) => ({
        url: `/irregularities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["irregularities"],
    }),
  }),
});

export const {
  useGetIrregularitiesQuery,
  useFindIrregularityQuery,
  useCreateIrregularityMutation,
  useUpdateIrregularityMutation,
  useDeleteIrregularityMutation,
  useLazyGetIrregularitiesQuery,
} = irregularitiesApi;
