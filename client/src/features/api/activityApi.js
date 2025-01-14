import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API base URL
const ACTIVITY_API = "http://localhost:8080/api";

// Create the API slice
export const activityApi = createApi({
  reducerPath: "activityApi", // Unique name for the slice
  tagTypes: ["ActivityLog"], // Tag used for cache invalidation or refetching
  baseQuery: fetchBaseQuery({
    baseUrl: ACTIVITY_API,
    credentials: "include", // Include credentials for cross-origin requests if needed
  }),

  endpoints: (builder) => ({
    // Get recent activity logs
    getActivityLog: builder.query({
      query: ({ page, limit }) => ({
        url: `/activity-log?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      invalidatesTags: ["ActivityLog"],
    }),
  }),
});

export const { useGetActivityLogQuery } = activityApi;
