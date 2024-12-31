import { Lead } from "../models/lead.js";
import { Tag } from "../models/tags.js";
import mongoose from "mongoose";

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, status, tags, comment, assignedTo } =
      req.body;

    const newLead = new Lead({
      name,
      email,
      phone,
      source,
      status,
      tags,
      comment,
      assignedTo,
    });

    await newLead.save();
    res
      .status(201)
      .json({ message: "Lead created successfully", lead: newLead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating lead", error });
  }
};

export const updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    // Validate if leadId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: "Invalid leadId format" });
    }

    const { name, email, phone, source, status, assignedTo, comment } =
      req.body;

    // Check if the lead exists before attempting to update
    const leadExists = await Lead.findById(leadId);
    if (!leadExists) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      {
        name: name ?? leadExists.name,
        email: email ?? leadExists.email,
        phone: phone ?? leadExists.phone,
        source: source ?? leadExists.source,
        status: status ?? leadExists.status,
        assignedTo: assignedTo ?? leadExists.assignedTo,
        comment: comment ?? leadExists.comment,
        updatedAt: Date.now(),
      },
      { new: true } // Returns the updated document
    );

    res
      .status(200)
      .json({ message: "Lead updated successfully", lead: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Error updating lead", error });
  }
};

// Delete a lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting lead", error });
  }
};

// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("tags")
      .populate("assignedTo")
      .sort({ createdAt: -1 }); // Populating tags data

    res.status(200).json({ message: "Leads fetched successfully", leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

// Get a lead by ID
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id)
      .populate("tags")
      .populate("assignedTo"); // Populating tags data

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead fetched successfully", lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lead", error });
  }
};

export const getLeadsAssignedToUser = async (req, res) => {
  try {
    // Extract the user ID from request parameters
    const { userId } = req.params; // Access userId from the authenticated user

    // Find all leads assigned to the specified user
    const leads = await Lead.find({ assignedTo: userId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: "No leads found for this user" });
    }

    res.status(200).json({ message: "Leads fetched successfully", leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

export const updateLeadStatus = async (req, res) => {
  const { leadId } = req.params; // Get leadId from request parameters
  const { status } = req.body; // Get the status from the request body

  console.log(status);
  try {
    // Find the lead by ID and update the status
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { status, updatedAt: Date.now() }, // Set the new status and update the updatedAt timestamp
      { new: true } // Return the updated lead
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Respond with the updated lead
    res.status(200).json({ message: "Lead status updated successfully", lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
