import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateLeadMutation, useGetLeadByIdQuery, useDeleteLeadMutation, } from '@/features/api/leadApi'; // Adjust according to your API
import { useGetSupportAgentsQuery } from '@/features/api/authApi';

const LeadTab = () => {
    const { leadId } = useParams();  // Get leadId from URL params
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        status: "New",
        assignedTo: "", // Will store ObjectId
    });

    const { data: leadData, isLoading: isLeadLoading, error: leadError } = useGetLeadByIdQuery(leadId);
    const { data: users, isLoading: isUsersLoading } = useGetSupportAgentsQuery(); // Fetch all users (to get their ObjectId)

    const [updateLead, { isLoading, isSuccess, error }] = useUpdateLeadMutation();
    const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

    // Update form fields with fetched lead data
    useEffect(() => {
        if (leadData) {
            setInput({
                name: leadData.lead.name,
                email: leadData.lead.email,
                phone: leadData.lead.phone,
                source: leadData.lead.source,
                status: leadData.lead.status,
                assignedTo: leadData.lead.assignedTo ? leadData.lead.assignedTo._id : "",
            });
        }
    }, [leadData]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const updateLeadHandler = async () => {
        if (!leadId) {
            toast.error("Lead ID is missing");
            return;
        }

        try {
            await updateLead({ leadId, leadData: input });
            navigate("/admin/lead")
        } catch (error) {
            toast.error("Failed to update lead");
        }
    };

    const deleteLeadHandler = async () => {
        try {
            await deleteLead(leadId);
            toast.success("Lead deleted successfully");
            navigate("/admin/lead");
        } catch (error) {
            toast.error("Failed to delete lead");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lead updated successfully.");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update lead");
        }
    }, [isSuccess, error]);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Lead Information</CardTitle>
                    <CardDescription>
                        Make changes to lead details here. Click save when you're done.
                    </CardDescription>
                </div>

                <div className="space-x-2">
                    <Button onClick={deleteLeadHandler} variant="outline" disabled={isDeleting}>
                        {isDeleting ? (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                            "Remove Lead"
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            placeholder="Enter name"
                            disabled={isLeadLoading}
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter email"
                            disabled={isLeadLoading}
                        />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input
                            type="text"
                            name="phone"
                            value={input.phone}
                            onChange={changeEventHandler}
                            placeholder="Enter phone number"
                            disabled={isLeadLoading}
                        />
                    </div>

                    <div>
                        <Label>Source</Label>
                        <Input
                            type="text"
                            name="source"
                            value={input.source}
                            onChange={changeEventHandler}
                            placeholder="Enter lead source"
                            disabled={isLeadLoading}
                        />
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Input
                            type="text"
                            name="status"
                            value={input.status}
                            onChange={changeEventHandler}
                            placeholder="Enter lead status"
                            disabled={isLeadLoading}
                        />
                    </div>
                    <div>
                        <Label>Assigned To</Label>
                        <select
                            name="assignedTo"
                            value={input.assignedTo}
                            onChange={changeEventHandler}
                            disabled={isLeadLoading}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-600"
                        >
                            <option value="">Select a User</option>
                            {users && users.map((user) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                    </div>



                    <div className="flex space-x-2">
                        <Button onClick={() => navigate("/admin/lead")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading || isLeadLoading} onClick={updateLeadHandler}>
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4">Please Wait</Loader2>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadTab;
