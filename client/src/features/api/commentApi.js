import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COMMENT_API = "http://localhost:8080/api/comment";

export const commentApi = createApi({
  reducerPath: "commentApi",
  tagTypes: ["Refetch_Comments"],
  baseQuery: fetchBaseQuery({
    baseUrl: COMMENT_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ content, leadId }) => ({
        url: `/add/${leadId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Refetch_Comments"],
    }),
    getCommentsByCourse: builder.query({
      query: (leadId) => ({
        url: `/${leadId}/comments`,
        method: "GET",
      }),
      providesTags: ["Refetch_Comments"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/delete/${commentId}`,
        method: "DELETE",
        body:{commentId}
      }),
      invalidatesTags: ["Refetch_Comments"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByCourseQuery,
  useDeleteCommentMutation,
} = commentApi;
