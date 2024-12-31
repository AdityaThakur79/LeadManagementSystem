import express from "express";
import { agentPerformance } from "../controllers/agentPerformanceController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

// Get agent performance
router.get("/performance", isAuthenticated, agentPerformance);

export default router;
