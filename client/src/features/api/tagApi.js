import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TAG_API = "http://localhost:8080/api/tag";

export const tagApi = createApi({
  reducerPath: "tagApi",
  tagTypes: ["Refetch_Tag"],
  baseQuery: fetchBaseQuery({
    baseUrl: TAG_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Create a new tag
    createTag: builder.mutation({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
      invalidatesTags: ["Refetch_Tag"],
    }),

    // Get all tags
    getAllTags: builder.query({
      query: ({page,limit}) => ({
        url: `/tags?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Tag"],
    }),

    // Get a single tag by ID
    getTagById: builder.query({
      query: (tagId) => ({
        url: `/tags/${tagId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Tag"],
    }),

    // Update a tag
    updateTag: builder.mutation({
      query: ({ tagId, tagData }) => ({
        url: `/tags/${tagId}`,
        method: "PUT",
        body: tagData,
      }),
      invalidatesTags: ["Refetch_Tag"],
    }),

    // Delete a tag
    deleteTag: builder.mutation({
      query: (tagId) => ({
        url: `/tags/${tagId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Tag"],
    }),
    getArticlesByTag: builder.query({
      query: (tagId) => ({
        url: `/tag-detail/${tagId}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateTagMutation,
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetArticlesByTagQuery,
} = tagApi;
