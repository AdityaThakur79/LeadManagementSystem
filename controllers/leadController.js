import { Lead } from "../models/lead.js";
import { Tag } from "../models/tags.js";
import mongoose from "mongoose";
import { leadSchema } from "../validationSchema/validationSchema.js";
import { ActivityLog } from "../models/activityModel.js";

// Create a new lead
export const createLead = async (req, res) => {
  try {
    // Validate request body
    const { error } = leadSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.details });
    }

    const { name, email, phone, source, status, tags, assignedTo } = req.body;

    const newLead = new Lead({
      name,
      email,
      phone,
      source,
      status,
      tags,
      assignedTo: assignedTo || null,
    });

    await newLead.save();
    res
      .status(201)
      .json({ message: "Lead created successfully", lead: newLead });

    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: newLead._id,
      action: "created",
      details: "Lead created",
    });
    activityLog.save();
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

    const { error } = leadSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.details });
    }

    const { name, email, phone, source, status, assignedTo, tags } = req.body;

    // Check if the lead exists before attempting to update
    const leadExists = await Lead.findById(leadId);
    if (!leadExists) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update the lead with optional fields
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      {
        name: name ?? leadExists.name,
        email: email ?? leadExists.email,
        phone: phone ?? leadExists.phone,
        source: source ?? leadExists.source,
        status: status ?? leadExists.status,
        assignedTo: assignedTo || null,
        tags: tags ?? leadExists.tags,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Lead updated successfully", lead: updatedLead });

    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: leadId,
      action: "updated",
      details: "Lead Updated",
    });
    activityLog.save();
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
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: id,
      action: "deleted",
      details: "Lead Deleted",
    });
    activityLog.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting lead", error });
  }
};

// Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = Number((page - 1) * limit);

    // Construct the search filter
    const searchFilter = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
            { phone: new RegExp(search, "i") },
          ],
        }
      : {};

    const totalLeads = await Lead.countDocuments(searchFilter);

    // Query logic based on search presence
    let leadsQuery = Lead.find(searchFilter)
      .populate("tags")
      .populate("assignedTo")
      .sort({ createdAt: -1 });

    if (!search) {
      leadsQuery = leadsQuery.skip(skip).limit(Number(limit));
    }

    const leads = await leadsQuery;

    res
      .status(200)
      .json({ message: "Leads fetched successfully", leads, totalLeads });
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
    const { userId } = req.params;

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
  const { leadId } = req.params;
  const { status } = req.body;
  console.log(req.id)
  try {
    // Find the lead by ID and update the status
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Respond with the updated lead
    res.status(200).json({ message: "Lead status updated successfully", lead });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: leadId,
      action: "updated",
      details: "Lead Status Updated",
    });
    activityLog.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
