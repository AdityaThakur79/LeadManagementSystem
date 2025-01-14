import { ActivityLog } from "../models/activityModel.js";
import { Course } from "../models/course.js";
import { Tag } from "../models/tags.js";
import { tagSchema } from "../validationSchema/validationSchema.js";

// Create a new tag
export const createTagController = async (req, res) => {
  try {
    const { error } = tagSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation Error", details: error.details });
    }

    const { name } = req.body;
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).send({ message: "Tag already exists" });
    }

    const tag = new Tag({ name });
    await tag.save();

    res.status(201).send({
      success: true,
      message: "Tag created successfully",
      tag,
    });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: null,
      action: "created",
      details: "New Tag Created",
    });
    activityLog.save();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating tag",
      error,
    });
  }
};

// Get all tags
export const getAllTagController = async (req, res) => {
  try {
    const { page = 1, limit = 1 } = req.query;
    const skip = Number((page - 1) * limit);

    const tags = await Tag.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalTags = await Tag.countDocuments();
    res.status(200).send({
      success: true,
      message: "Tags fetched successfully",
      tags,
      totalTags,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching tags",
      error,
    });
  }
};

// Get a single tag by ID
export const getTagByIdController = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }
    res.status(200).send({
      success: true,
      message: "Tag fetched successfully",
      tag,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching tag",
      error,
    });
  }
};

export const updateTagController = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    res.status(200).send({
      success: true,
      message: "Tag updated successfully",
      tag,
    });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: null,
      action: "updated",
      details: "Tag Updated",
    });
    activityLog.save();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating tag",
      error,
    });
  }
};

// Delete a tag
export const deleteTagController = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    res.status(200).send({
      success: true,
      message: "Tag deleted successfully",
    });
    const activityLog = new ActivityLog({
      userId: req.id,
      leadId: null,
      action: "deleted",
      details: "Tag Deleted",
    });
    activityLog.save();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting tag",
      error,
    });
  }
};

export const getArticlesByTag = async (req, res) => {
  try {
    const { tagId } = req.params;

    const articles = await Course.find({ tags: tagId })
      .populate("creator", "name photoUrl")
      .populate("category", "name");

    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found for this tag" });
    }

    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching articles by tag:", error);
    res.status(500).json({ message: "Server error" });
  }
};
