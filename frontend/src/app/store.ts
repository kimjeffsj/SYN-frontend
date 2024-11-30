import authReducer from "@/features/auth/slice/authSlice";
import scheduleReducer from "@/features/schedule/slice/scheduleSlice";
import adminDashboardReducer from "@/features/admin-dashboard/slice/adminDashboardSlice";
import employeeDashboardReducer from "@/features/employee-dashboard/slice/employeeDashboardSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    adminDashboard: adminDashboardReducer,
    employeeDashboard: employeeDashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
