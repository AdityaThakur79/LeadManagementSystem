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

const AddLead = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("website");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState("");
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState(""); // New state for comment

  const { data: supportAgents, isLoading: agentsLoading, error: agentsError } = useGetSupportAgentsQuery();
  const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useGetAllTagsQuery();
  const [createLead, { data, isLoading, error, isSuccess }] = useCreateLeadMutation();
  const navigate = useNavigate();

  const createLeadHandler = async () => {
    try {
      await createLead({ name, email, phone, source, status, assignedTo, tags, comment }).unwrap(); // Include comment
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
      toast.error(error?.data?.message || "Failed to create lead");
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

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Add Lead</h1>
        <p className="text-sm">Create a new lead by providing their details and assigning relevant information.</p>
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
          />
        </div>

        {/* Source Field */}
        <div>
          <Label>Source</Label>
          <Select onValueChange={(value) => setSource(value)} value={source}>
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

        {/* Status Field */}
        <div>
          <Label>Status</Label>
          <Select onValueChange={(value) => setStatus(value)} value={status}>
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

        {/* Assigned To Field */}
        <div>
          <Label>Assigned To (Support Agent)</Label>
          <Select onValueChange={(value) => setAssignedTo(value)} value={assignedTo}>
            <SelectTrigger className="w-[180px]">
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

        {/* Comment Field */}
        <div>
          <Label>Comment</Label>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
          />
        </div>

        {/* Tags Field */}
        <div>
          <Label>Tags</Label>
          <Select
            multiple
            value={tags}
            onValueChange={(selectedTags) => setTags(selectedTags)}
            placeholder="Select tags"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tags</SelectLabel>
                {tagsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading tags...
                  </SelectItem>
                ) : (
                  tagsData?.tags?.map((tag) => (
                    <SelectItem key={tag._id} value={tag._id}>
                      {tag.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center gap-2">
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
