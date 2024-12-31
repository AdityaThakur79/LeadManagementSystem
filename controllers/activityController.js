import { ActivityLog } from "../models/activityModel.js";

export const getActivityLog = async (req, res) => {
  try {
    // Get last 10 logs and populate user and lead data
    const logs = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("userId", "name email") // Specify the fields to populate from the User model (e.g., name, email)
      .populate("leadId", "name email"); // Specify the fields to populate from the Lead model (e.g., title, description)

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createActivityLog = async (req, res) => {
  const { userId, action, leadId } = req.body;
  const newLog = new ActivityLog({ userId, action, leadId });
  try {
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
