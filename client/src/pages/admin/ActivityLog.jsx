import React, { useState } from "react";
import { useGetActivityLogQuery } from "@/features/api/activityApi"; // Adjust path if needed
import { Button } from "@/components/ui/button";

const ActivityLog = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data: activityLogs, error, isLoading } = useGetActivityLogQuery({ page: currentPage, limit: pageSize });

    if (isLoading) {
        return <div className="text-center py-10">Loading Activity Logs...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error.message || "Error fetching activity logs."}</div>;
    }

    const totalPages = Math.ceil(activityLogs.totalLogs / pageSize);

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
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Action Performer</th>
                            {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Lead</th> */}
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Details</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityLogs?.logs?.map((log) => (
                            <tr key={log._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.action}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.userId.name}</td>
                                {/* <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.leadId?.name || ""}</td> */}
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.details}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{new Date(log.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination mt-4 flex justify-center items-center space-x-2">
                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</Button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ActivityLog;
