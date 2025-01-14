import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  addCommentController,
  deleteCommentController,
  editComment,
  getCommentController,
} from "../controllers/commentController.js";
const router = express.Router();

// Add a comment
router.post("/add/:leadId", isAuthenticated, addCommentController);

// Delete a comment
router.delete("/delete/:commentId", isAuthenticated, deleteCommentController);

// Fetch comments by LeadId
router.get("/:leadId/comments", isAuthenticated, getCommentController);

//Edit Comment by CommentId
router.put("/edit/:commentId", editComment);

export default router;
