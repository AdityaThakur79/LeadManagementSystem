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
      query: () => ({
        url: "/activity-log", // The API route for activity logs
        method: "GET",
      }),
      providesTags: ["ActivityLog"], // Cache data with this tag
    }),

    // Create a new activity log
    createActivityLog: builder.mutation({
      query: (logData) => ({
        url: "/activity-log",
        method: "POST",
        body: logData,
      }),
      invalidatesTags: ["ActivityLog"], // Invalidate cache so data can be refreshed
    }),
  }),
});

export const {
  useGetActivityLogQuery, // Hook for querying activity logs
  useCreateActivityLogMutation, // Hook for creating an activity log
} = activityApi;
