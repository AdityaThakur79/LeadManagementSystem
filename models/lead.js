import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Lost", "Won"],
    default: "New",
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.model("Lead", leadSchema);
