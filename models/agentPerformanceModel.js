import mongoose from "mongoose";

const agentPerformanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leadsHandled: { type: Number, default: 0 },
    leadsConverted: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 },  
    leadStatuses: { type: Map, of: Number, default: {} },  
  },
  { timestamps: true }
);

export const AgentPerformance = mongoose.model('AgentPerformance', agentPerformanceSchema);

