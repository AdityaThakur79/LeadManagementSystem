import React, { useState } from "react";
import Papa from "papaparse";
import {
  useGetAllLeadsQuery,
  useUpdateLeadMutation,
  useCreateLeadMutation,
} from "../../../features/api/leadApi";
import { useGetAllTagsQuery } from "../../../features/api/tagApi";
import { useGetSupportAgentsQuery } from "../../../features/api/authApi";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "../../../components/ui/table";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeadTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // API calls
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useGetAllLeadsQuery();
  const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useGetAllTagsQuery();
  const { data: agentsData, isLoading: agentsLoading, error: agentsError } = useGetSupportAgentsQuery();

  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const [filters, setFilters] = useState({
    status: "",
    tags: "",
    assignedAgent: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const [file, setFile] = useState(null);

  // Handle filter changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImportCSV = () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    Papa.parse(file, {
      complete: async (result) => {
        const leads = result.data;
        // Here, you would map the CSV data into the structure required by your API
        // Assuming the CSV data has fields like: name, email, phone, source, etc.

        for (const lead of leads) {
          const leadData = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: lead.status,
            comment: lead.comment,
            assignedTo: lead.assignedTo, // Assuming this is handled correctly
          };
          await createLead(leadData);
        }
        alert("Leads imported successfully!");
      },
      header: true, // If your CSV has headers
    });
  };

  const filteredLeads = leadsData?.leads?.filter((lead) => {
    const matchesStatus = filters.status ? lead.status === filters.status : true;
    const matchesTags = filters.tags ? lead.tags?.includes(filters.tags) : true;
    const matchesAgent = filters.assignedAgent
      ? lead.assignedTo?._id === filters.assignedAgent
      : true;
    const matchesSearch = filters.search
      ? [lead.name, lead.email, lead.phone]
        .join(" ")
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      : true;
    const matchesDateRange =
      (!filters.startDate || new Date(lead.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(lead.createdAt) <= new Date(filters.endDate));
    return matchesStatus && matchesTags && matchesAgent && matchesSearch && matchesDateRange;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = filteredLeads?.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil((filteredLeads?.length || 0) / rowsPerPage);

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredLeads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads.csv";
    link.click();
  };

  if (leadsLoading) return <h1>Loading...</h1>;

  const handleAgentChange = async (leadId, newAgentId) => {
    try {
      const existingLead = leadsData?.leads?.find((lead) => lead._id === leadId);

      if (!existingLead) {
        alert("Lead not found. Please refresh the page.");
        return;
      }

      const leadData = {
        name: existingLead.name,
        email: existingLead.email,
        phone: existingLead.phone,
        source: existingLead.source,
        status: existingLead.status,
        comment: existingLead.comment,
        assignedTo: newAgentId,
      };

      await updateLead({ leadId, leadData }).unwrap();
      alert("Assigned agent updated successfully!");
    } catch (err) {
      console.error("Error updating agent:", err);
      alert("Failed to update assigned agent.");
    }
  };

  return (
    <div className="p-6">
      <Button onClick={() => navigate("/admin/lead/create")} className="mb-6">
        Create a New Lead
      </Button>

      {/* Filters */}
      <div className="filters mb-6 grid grid-cols-2 gap-">
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Won">Won</option>
        </select>
        <select
          name="tags"
          value={filters.tags}
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        >
          <option value="">All Tags</option>
          {tagsData?.tags.map((tag) => (
            <option key={tag._id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
        <select
          name="assignedAgent"
          value={filters.assignedAgent}
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        >
          <option value="">All Agents</option>
          {agentsData?.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="search"
          value={filters.search}
          placeholder="Search by Name/Email/Phone"
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleInputChange}
          className="p-2 border rounded-lg bg-gray-500"
        />
      </div>

      {/* Import CSV */}
      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="p-2 border rounded-lg bg-gray-500"
        />
        <Button onClick={handleImportCSV} className="ml-2">
          Import Leads from CSV
        </Button>
      </div>

      {/* Export CSV */}
      <Button onClick={handleExportCSV} className="mb-6">
        Export to CSV
      </Button>

      {/* Table */}
      <Table>
        <TableCaption>A list of your leads.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLeads?.map((lead, index) => (
            <TableRow key={lead._id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{lead.status}</TableCell>

              <select
                value={lead.assignedTo?._id || ""}
                onChange={(e) => handleAgentChange(lead._id, e.target.value)}
                className="border rounded p-1 bg-gray-500"
              >
                <option value="">Not Assigned</option>
                {agentsData?.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/admin/lead/${lead._id}`)}
                  >
                    <Edit />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default LeadTable;
