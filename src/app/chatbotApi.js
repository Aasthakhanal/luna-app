import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authHeaders } from "@/lib/authHeaders";
import { BASE_URL } from "@/lib/constants";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: authHeaders,
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "chatbot",
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatbotApi;
