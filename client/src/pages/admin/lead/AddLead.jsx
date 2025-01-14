import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateLeadMutation } from "@/features/api/leadApi";
import { useGetSupportAgentsQuery } from "@/features/api/authApi";
import { useGetAllTagsQuery } from "@/features/api/tagApi";
import { toast } from "sonner";
import Selectt from "react-select";

const AddLead = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("website");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState(null);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");

  const { data: supportAgents, isLoading: agentsLoading, error: agentsError } = useGetSupportAgentsQuery();
  const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useGetAllTagsQuery({ page: 1, limit: 50 });
  const [createLead, { data, isLoading, error, isSuccess }] = useCreateLeadMutation();
  const navigate = useNavigate();

  const createLeadHandler = async () => {
    try {
      await createLead({ name, email, phone, source, status, assignedTo, tags }).unwrap(); // Include comment
      navigate("/admin/lead");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lead Created Successfully");
      navigate("/admin/lead");
    }
    if (error) {
      toast.error(error?.data?.details[0].message || "Failed to create lead");
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (agentsError) {
      toast.error("Failed to fetch support agents");
    }
  }, [agentsError]);

  useEffect(() => {
    if (tagsError) {
      toast.error("Failed to fetch tags");
    }
  }, [tagsError]);

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

  const handleTagsChange = (selectedOptions) => {
    const selectedTags = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setTags(selectedTags);
  };

  const tagOptions = tagsData?.tags?.map((tag) => ({
    value: tag._id,
    label: tag.name,
  })) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl sm:text-2xl">Add Lead</h1>
        <p className="text-sm sm:text-base">Create a new lead by providing their details and assigning relevant information.</p>
      </div>
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full"
          />
        </div>

        {/* Email Field */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full"
          />
        </div>

        {/* Phone Field */}
        <div>
          <Label>Phone</Label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full"
          />
        </div>

        {/* Source Field */}
        <div>
          <Label>Source</Label>
          <Select onValueChange={(value) => setSource(value)} value={source} className="w-full">
            <SelectTrigger>
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

        {/* Tags Field */}
        <div>
          <Label>Tags</Label>
          <Selectt
            isMulti
            options={tagOptions}
            value={tagOptions.filter(option => tags.includes(option.value))}
            onChange={handleTagsChange}
            placeholder="Select"
            className="w-full"
          />
        </div>

        {/* Status Field */}
        <div>
          <Label>Status</Label>
          <Select onValueChange={(value) => setStatus(value)} value={status} className="w-full">
            <SelectTrigger>
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

        {/* Assigned To Field */}
        <div>
          <Label>Assigned To (Support Agent)</Label>
          <Select onValueChange={(value) => setAssignedTo(value)} value={assignedTo} className="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select Support Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Support Agents</SelectLabel>
                {agentsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  supportAgents?.map((agent) => (
                    <SelectItem key={agent._id} value={agent._id}>
                      {agent.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/lead")}>Back</Button>
          <Button disabled={isLoading} onClick={createLeadHandler}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLead;
