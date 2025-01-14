import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LEAD_API = "http://localhost:8080/api/lead"; // Replace with your server URL

export const leadApi = createApi({
  reducerPath: "leadApi",
  tagTypes: ["Lead", "Refetch_Lead"],
  baseQuery: fetchBaseQuery({
    baseUrl: LEAD_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Create a new lead
    createLead: builder.mutation({
      query: (leadData) => ({
        url: "/leads",
        method: "POST",
        body: leadData,
      }),
      invalidatesTags: ["Refetch_Lead"],
    }),

    // Get all leads
    getAllLeads: builder.query({
      query: ({ page, limit, search = "" }) => ({
        url: `/leads?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        method: "GET",
      }),
      providesTags: ["Lead", "Refetch_Lead"],
    }),

    // Get a single lead by ID
    getLeadById: builder.query({
      query: (leadId) => ({
        url: `/leads/${leadId}`,
        method: "GET",
      }),
      providesTags: (result, error, leadId) => [{ type: "Lead", id: leadId }],
    }),

    // Update a lead
    updateLead: builder.mutation({
      query: ({ leadId, leadData }) => ({
        url: `/leads/${leadId}`,
        method: "PUT",
        body: leadData,
      }),
      invalidatesTags: ["Refetch_Lead"],
    }),

    // Delete a lead
    deleteLead: builder.mutation({
      query: (leadId) => ({
        url: `/leads/${leadId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lead"],
    }),

    // Get tags for a lead (optional, if needed)
    getTagsForLead: builder.query({
      query: (leadId) => ({
        url: `/leads/${leadId}/tags`,
        method: "GET",
      }),
    }),
    getLeadsAssignedToUser: builder.query({
      query: (userId) => `/leads/assigned/${userId}`,
    }),
    updateLeadStatus: builder.mutation({
      query: ({ leadId, status }) => ({
        url: `/leads/${leadId}/status`, // API route to update status
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Refetch_Lead"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateLeadMutation,
  useGetAllLeadsQuery,
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetTagsForLeadQuery,
  useGetLeadsAssignedToUserQuery,
  useUpdateLeadStatusMutation,
} = leadApi;
