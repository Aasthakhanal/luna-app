import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/constants";
import { authHeaders } from "../lib/authHeaders";

export const gynecologistsApi = createApi({
  reducerPath: "gynecologistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  tagTypes: ["gynecologists"],
  endpoints: (builder) => ({
    getGynecologists: builder.query({
      query: ({ limit = 10, page = 1, latitude, longitude } = {}) => {
        const params = { limit, page };
        if (latitude && longitude) {
          params.latitude = latitude;
          params.longitude = longitude;
        }
        return {
          url: "/gynecologists",
          method: "GET",
          params,
        };
      },
      providesTags: ["gynecologists"],
    }),

    findGynecologist: builder.query({
      query: (id) => `/gynecologists/${id}`,
      providesTags: ["gynecologists"],
    }),

    createGynecologist: builder.mutation({
      query: (body) => ({
        url: "/gynecologists",
        method: "POST",
        body,
      }),
      invalidatesTags: ["gynecologists"],
    }),

    updateGynecologist: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/gynecologists/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["gynecologists"],
    }),

    deleteGynecologist: builder.mutation({
      query: (id) => ({
        url: `/gynecologists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gynecologists"],
    }),
  }),
});

export const {
  useGetGynecologistsQuery,
  useFindGynecologistQuery,
  useCreateGynecologistMutation,
  useUpdateGynecologistMutation,
  useDeleteGynecologistMutation,
  useLazyGetGynecologistsQuery,
} = gynecologistsApi;
