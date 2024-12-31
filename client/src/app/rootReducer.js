import authReducer from "../features/authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
import { tagApi } from "@/features/api/tagApi.js";
import { leadApi } from "@/features/api/leadApi.js";
import { commentApi } from "@/features/api/commentApi.js";
import { agentApi } from "@/features/api/agentPerformanceApi.js";
import { activityApi } from "@/features/api/activityApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  [tagApi.reducerPath]: tagApi.reducer,
  [leadApi.reducerPath]: leadApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [agentApi.reducerPath]: agentApi.reducer,
  [activityApi.reducerPath] : activityApi.reducer,
  auth: authReducer,
});

export default rootReducer;
