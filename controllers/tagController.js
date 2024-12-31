import { Course } from "../models/course.js";
import { Tag } from "../models/tags.js";

// Create a new tag
export const createTagController = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({ message: "Tag name is required" });
    }

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
  } catch (error) {
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
    const tags = await Tag.find();
    res.status(200).send({
      success: true,
      message: "Tags fetched successfully",
      tags,
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
