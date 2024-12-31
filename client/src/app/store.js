import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";
import { tagApi } from "@/features/api/tagApi.js";
import { leadApi } from "@/features/api/leadApi.js";
import { commentApi } from "@/features/api/commentApi.js";
import { agentApi } from "@/features/api/agentPerformanceApi.js";
import { activityApi } from "@/features/api/activityApi.js";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
      tagApi.middleware,
      leadApi.middleware,
      commentApi.middleware,
      agentApi.middleware,
      activityApi.middleware
    ),
});

const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
