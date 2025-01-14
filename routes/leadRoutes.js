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
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// POST /leads
router.post("/leads",isAuthenticated, createLead);

// Route to update a lead by ID
// PUT /leads/:id
router.put("/leads/:id",isAuthenticated, updateLead);

// Route to delete a lead by ID
// DELETE /leads/:id
router.delete("/leads/:id",isAuthenticated, deleteLead);

// Route to get all leads
// GET /leads
router.get("/leads", getAllLeads);

// Route to get a lead by ID
// GET /leads/:id
router.get("/leads/:id", getLeadById);

router.get("/leads/assigned/:userId",getLeadsAssignedToUser)

router.put("/leads/:leadId/status",isAuthenticated, updateLeadStatus);

export default router;
