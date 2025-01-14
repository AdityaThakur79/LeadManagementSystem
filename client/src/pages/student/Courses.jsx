import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeadsAssignedToUserQuery } from '@/features/api/leadApi.js';
import { selectUserId } from '@/features/authSlice.js';
import Lead from './Course.jsx';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetAllTagsQuery } from '@/features/api/tagApi.js';

const Courses = () => {
    const userId = useSelector(selectUserId);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'all', // Default to "all"
        tags: 'all', // Default to "all"
        startDate: null,
        endDate: null,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 8;

    // Fetch leads and tags
    const { data, isLoading, error } = useGetLeadsAssignedToUserQuery(userId);
    const { data: tagsData, isLoading: isTagsLoading, error: tagsError } = useGetAllTagsQuery();

    // Handle filters
    const filteredLeads = data?.leads?.filter((lead) => {
        const matchesSearch =
            lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.phone.includes(filters.search);

        const matchesStatus = filters.status === 'all' || lead.status === filters.status;

        const matchesTags = filters.tags === 'all' || lead.tags.includes(filters.tags);

        const matchesDateRange = (!filters.startDate || new Date(lead.date) >= filters.startDate) &&
            (!filters.endDate || new Date(lead.date) <= filters.endDate);

        return matchesSearch && matchesStatus && matchesTags && matchesDateRange;
    });

    // Calculate leads to display on the current page
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads?.slice(indexOfFirstLead, indexOfLastLead);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredLeads?.length / leadsPerPage);

    if (error) {
        return <div className="text-center text-red-500">No Leads Assigned to You</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-[#141414]">
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="font-bold text-3xl text-center mb-10">Leads Assigned to User</h2>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Search */}
                    <Input
                        placeholder="Search by Name/Email/Phone"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />

                    {/* Status */}
                    <Select
                        onValueChange={(value) => handleFilterChange('status', value)}
                        value={filters.status}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Contacted">Contacted</SelectItem>
                                <SelectItem value="Qualified">Qualified</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Tags */}
                    <Select
                        onValueChange={(value) => handleFilterChange('tags', value)}
                        value={filters.tags || 'all'}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Tags" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tags</SelectLabel>
                                {isTagsLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : tagsError ? (
                                    <SelectItem value="error" disabled>Error loading tags</SelectItem>
                                ) : (
                                    <>
                                        <SelectItem value="all">All</SelectItem>
                                        {tagsData?.tags?.map((tag) => (
                                            <SelectItem key={tag._id} value={tag._id}>
                                                {tag.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Date Range */}
                    <div className="flex gap-2">
                        <DatePicker
                            selected={filters.startDate}
                            onChange={(date) => handleFilterChange('startDate', date)}
                            placeholderText="Start Date"
                            className="w-full p-2 border rounded"
                        />
                        <DatePicker
                            selected={filters.endDate}
                            onChange={(date) => handleFilterChange('endDate', date)}
                            placeholderText="End Date"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Leads */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => <LeadSkeleton key={index} />)
                    ) : (
                        currentLeads?.map((lead) => <Lead key={lead._id} lead={lead} />)
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-6 py-2  bg-gray-500 text-white rounded-l-lg disabled:opacity-50 m-2"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-6 py-2  rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 m-2'} border`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-6 py-2 bg-gray-500 text-white rounded-r-lg disabled:opacity-50 m-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Courses;

const LeadSkeleton = () => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};
