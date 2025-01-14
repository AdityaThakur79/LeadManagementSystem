import { ActivityLog } from "../models/activityModel.js";

export const getActivityLog = async (req, res) => {
  try {
    // Get last 10 logs and populate user and lead data

    const { page = 1, limit = 10 } = req.query;
    const skip = Number((page - 1) * limit);
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("leadId", "name email")
      .skip(skip)
      .limit(limit);
    const totalLogs = await ActivityLog.countDocuments();
    res.status(200).json({ logs, totalLogs });
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
