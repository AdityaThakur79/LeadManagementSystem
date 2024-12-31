import express from "express";
import {
  createLead,
  deleteLead,
  getAllLeads,
  getLeadById,
  getLeadsAssignedToUser,
  updateLead,
  updateLeadStatus,
} from "../controllers/leadController.js";
const router = express.Router();

// POST /leads
router.post("/leads", createLead);

// Route to update a lead by ID
// PUT /leads/:id
router.put("/leads/:id", updateLead);

// Route to delete a lead by ID
// DELETE /leads/:id
router.delete("/leads/:id", deleteLead);

// Route to get all leads
// GET /leads
router.get("/leads", getAllLeads);

// Route to get a lead by ID
// GET /leads/:id
router.get("/leads/:id", getLeadById);

router.get("/leads/assigned/:userId",getLeadsAssignedToUser)

router.put("/leads/:leadId/status", updateLeadStatus);

export default router;
