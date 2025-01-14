import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { useGetAllLeadsQuery } from '@/features/api/leadApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetSupportAgentsQuery } from '@/features/api/authApi';

const Dashboard = () => {
    const { data: leadsData = [], isSuccess, isError, isLoading } = useGetAllLeadsQuery({ page: 1, limit: 50 });
    const { data: agentsData } = useGetSupportAgentsQuery();

    const lead = leadsData?.leads;

    // Check if leadsData is an array, else return empty array
    const leads = Array.isArray(lead) ? lead : [];
    const totalLeads = leads?.length;
    const totalAgents = agentsData?.length;

    // Process leadsData to get the counts of each lead status
    const processStatusData = () => {
        const statusCounts = leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {});

        // Convert statusCounts into the format expected by Pie chart
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    };

    // Process leadsData to get the counts of each lead source
    const processSourceData = () => {
        const sourceCounts = leads.reduce((acc, lead) => {
            acc[lead.source] = (acc[lead.source] || 0) + 1;
            return acc;
        }, {});

        // Convert sourceCounts into the format expected by Pie chart
        return Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
    };

    // Process leadsData to get the counts of each lead tag
    const processTagData = () => {
        const tagCounts = leads.reduce((acc, lead) => {
            if (Array.isArray(lead.tags)) {
                lead.tags.forEach(tag => {
                    if (tag.name) {
                        acc[tag.name] = (acc[tag.name] || 0) + 1;
                    }
                });
            }
            return acc;
        }, {});

        // Convert tagCounts into the format expected by Bar chart
        return Object.entries(tagCounts).map(([name, value]) => ({ name, value }));
    };

    // Pie chart data
    const statusChartData = processStatusData();
    const sourceChartData = processSourceData();
    const tagChartData = processTagData();

    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    if (isLoading) return <p>Loading chart...</p>;
    if (isError) return <p>Error fetching data</p>;

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600 text-center">{totalLeads}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Support Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600 text-center">{totalAgents}</p>
                </CardContent>
            </Card>

            <Card className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Lead Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <PieChart width={300} height={300}>
                            <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {statusChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Lead Source Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <PieChart width={300} height={300}>
                            <Pie data={sourceChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {sourceChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Lead Tags Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center overflow-x-auto">
                        <BarChart
                            width={400}
                            height={300}
                            data={tagChartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <RechartsLegend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
