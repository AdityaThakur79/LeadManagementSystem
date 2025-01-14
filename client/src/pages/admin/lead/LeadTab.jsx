import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateLeadMutation, useGetLeadByIdQuery, useDeleteLeadMutation } from '@/features/api/leadApi';
import { useGetSupportAgentsQuery } from '@/features/api/authApi';
import Selectt from "react-select";
import { useGetAllTagsQuery } from '@/features/api/tagApi';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const LeadTab = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        email: "",
        phone: "",
        source: "",
        status: "New",
        assignedTo: "",
        tags: [],
    });

    const { data: leadData, isLoading: isLeadLoading, error: leadError } = useGetLeadByIdQuery(leadId);
    const { data: users, isLoading: isUsersLoading } = useGetSupportAgentsQuery();
    const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useGetAllTagsQuery({ page: 1, limit: 50 });

    const [updateLead, { data, isLoading, isSuccess, error }] = useUpdateLeadMutation();
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
                tags: leadData.lead.tags || [],
            });
        }
    }, [leadData]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleTagsChange = (selectedOptions) => {
        const selectedTags = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setInput(prev => ({ ...prev, tags: selectedTags }));
    };

    const updateLeadHandler = async () => {
        if (!leadId) {
            toast.error("Lead ID is missing");
            return;
        }

        try {
            const leadPayload = {
                ...input,
                assignedTo: input.assignedTo || null,
            };

            await updateLead({ leadId, leadData: leadPayload });

        } catch (error) {
            console.log(error)
        }
    }

    const deleteLeadHandler = async () => {
        try {
            await deleteLead(leadId);
            toast.success("Lead deleted successfully");
            navigate("/admin/lead");
        } catch (error) {
            toast.error("Failed to delete lead");
        }
    };

    const tagOptions = tagsData?.tags?.map(tag => ({
        value: tag._id,
        label: tag.name,
    })) || [];

    // Set default value for tags in react-select
    const defaultSelectedTags = tagOptions.filter(option =>
        input.tags.some(tag => tag._id === option.value)
    );

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lead updated successfully.");
            navigate()
        }
        if (error) {
            toast.error(error.data.details[0].message || "Failed to update lead");
        }
    }, [isSuccess, error]);

    const sources = [
        { label: "Website", value: "website" },
        { label: "Referral", value: "referral" },
        { label: "Social Media", value: "socialMedia" },
    ];

    const statuses = [
        { label: "New", value: "New" },
        { label: "Contacted", value: "Contacted" },
        { label: "Qualified", value: "Qualified" },
        { label: "Lost", value: "Lost" },
        { label: "Won", value: "Won" },
    ];

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
                        <Label>Tags</Label>
                        <Selectt
                            isMulti
                            options={tagOptions}
                            value={defaultSelectedTags}
                            onChange={handleTagsChange}
                            isDisabled={tagsLoading}
                            className="react-select-container text-gray-500"
                        />
                    </div>

                    <div>
                        <Label>Source</Label>
                        <Select onValueChange={(value) => setInput(prev => ({ ...prev, source: value }))} value={input.source}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Source</SelectLabel>
                                    {sources.map((source) => (
                                        <SelectItem key={source.value} value={source.value}>
                                            {source.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select onValueChange={(value) => setInput(prev => ({ ...prev, status: value }))} value={input.status}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {statuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                            <option value="">Unassigned</option>
                            {users && users.map(user => (
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
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
