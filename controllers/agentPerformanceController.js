import { AgentPerformance } from "../models/agentPerformanceModel.js";

export const agentPerformance = async (req, res) => {
  try {
    const agentPerformance = await AgentPerformance.find().populate(
      "userId",
      "name email"
    ); // Populate the 'name' and 'email' fields from the User model

    res.status(201).send({ agentPerformance, message: "PerformanceFetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
