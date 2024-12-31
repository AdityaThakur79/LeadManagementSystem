import React, { useState } from "react";
import { useGetActivityLogQuery } from "@/features/api/activityApi"; // Adjust path if needed

const ActivityLog = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;  // Adjust the number of logs per page

    // Fetch activity logs using the RTK Query hook
    const { data: activityLogs, error, isLoading } = useGetActivityLogQuery();

    if (isLoading) {
        return <div className="text-center py-10">Loading Activity Logs...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error.message || "Error fetching activity logs."}</div>;
    }

    const totalLogs = activityLogs?.length || 0;
    const totalPages = Math.ceil(totalLogs / pageSize);

    // Slice logs to get only the current page logs
    const currentLogs = activityLogs?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity Log</h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Action</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">User</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Lead</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs?.map((log) => (
                            <tr key={log._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.action}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.userId.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.leadId.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
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

export default ActivityLog;
