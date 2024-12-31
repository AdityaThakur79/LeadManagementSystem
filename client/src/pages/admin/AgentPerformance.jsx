import React, { useState } from "react";
import { useGetAgentPerformanceQuery } from "@/features/api/agentPerformanceApi"; // Adjust path if needed

const AgentPerformance = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;  // Adjust the number of logs per page

    // Fetch agent performance data using the RTK Query hook
    const { data: agentPerformances, error, isLoading } = useGetAgentPerformanceQuery();
    if (isLoading) {
        return <div className="text-center py-10">Loading Agent Performance...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error.message || "Error fetching agent performance data."}</div>;
    }

    const totalPerformanceData = agentPerformances?.length || 0;
    const totalPages = Math.ceil(totalPerformanceData / pageSize);

    // Slice data to get only the current page's performance data
    const currentPerformanceData = agentPerformances?.agentPerformance?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
console.log(currentPerformanceData)
    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Agent Performance</h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Agent</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Leads Handled</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Leads Converted</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Average Response Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPerformanceData?.map((performance) => (
                            <tr key={performance.agentId} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{performance.userId.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{performance?.leadsHandled}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{performance.leadsConverted}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{performance.avgResponseTime} Mins</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AgentPerformance;
