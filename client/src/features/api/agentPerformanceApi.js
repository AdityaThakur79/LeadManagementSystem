import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API base URL
const AGENT_API = "http://localhost:8080/api";

// Create the API slice
export const agentApi = createApi({
  reducerPath: "agentApi", // Unique name for the slice
  tagTypes: ["AgentPerformance"], // Tag used for cache invalidation or refetching
  baseQuery: fetchBaseQuery({
    baseUrl: AGENT_API,
    credentials: "include", // Include credentials for cross-origin requests if needed
  }),

  endpoints: (builder) => ({
    // Get agent performance
    getAgentPerformance: builder.query({
      query: () => ({
        url: "/performance", // The API route for agent performance
        method: "GET",
      }),
      providesTags: ["AgentPerformance"], // Cache data with this tag
    }),
  }),
});

export const {
  useGetAgentPerformanceQuery, // Hook for querying agent performance
} = agentApi;
