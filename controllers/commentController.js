import { ActivityLog } from "../models/activityModel.js";
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
    );
    res.status(201).json({
      message: "Comment added successfully!",
      comment: populatedComment,
    });
     const activityLog = new ActivityLog({
          userId: req.id,
          leadId:leadId,
          action: "created",
          details: "Comment Created",
        });
        activityLog.save();
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
  try {
    const { leadId } = req.params;
    const { page=1, limit=1 } = req.query;
    const skip = Number((page - 1) * limit);

    // Fetch comments with pagination
    const comments = await Comment.find({ lead: leadId })
      .populate("creator", "name photoUrl role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get the total count of comments
    const totalComments = await Comment.countDocuments({ lead: leadId });

    // Return paginated comments along with total count and metadata
    res.status(200).json({
      comments,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    // Check if comment exists
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .send({ success: false, message: "Comment not found" });
    }

    // Update the comment text
    comment.content = text;

    await comment.save();

    return res.status(200).send({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating comment" });
  }
};
