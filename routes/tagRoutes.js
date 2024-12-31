import express from "express";
import {
  createTagController,
  getAllTagController,
  getTagByIdController,
  updateTagController,
  deleteTagController,
  getArticlesByTag,
} from "../controllers/tagController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Routes
// Create a tag
router.post("/tags", isAuthenticated, createTagController);

// Get all tags
router.get("/tags", getAllTagController);

// Get a single tag by ID
router.get("/tags/:id", getTagByIdController);

// Update a tag
router.put("/tags/:id", isAuthenticated, updateTagController);

// Delete a tag
router.delete("/tags/:id", isAuthenticated, deleteTagController);
router.get("/tag-detail/:tagId", isAuthenticated, getArticlesByTag);

export default router;
