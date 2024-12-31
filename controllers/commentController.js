import { Comment } from "../models/comment.js";

export const addCommentController = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment content cannot be empty" });
    }

    const newComment = await Comment.create({
      content,
      creator: req.id,
      lead: leadId,
    });
    const populatedComment = await newComment.populate(
      "creator",
      "name photoUrl"
    ); // Populate author details
    res.status(201).json({
      message: "Comment added successfully!",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const deleteCommentController = async (req, res) => {
  const { commentId } = req.body;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const getCommentController = async (req, res) => {
  const { leadId } = req.params;

  try {
    const comments = await Comment.find({ lead: leadId })
      .populate("creator", "name photoUrl") // Populate author details
      .sort({ createdAt: -1 }); // Optional: Sort comments by newest first

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
