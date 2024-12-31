import {
  createActivityLog,
  getActivityLog,
} from "../controllers/activityController.js";

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get recent activity logs
router.get("/activity-log", isAuthenticated, getActivityLog);

// Log activity (for actions like lead status update, agent assignment)
router.post("/activity-log",isAuthenticated, createActivityLog);

export default router;
