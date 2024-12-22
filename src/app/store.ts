import authReducer from "@/features/auth/slice/authSlice";
import scheduleReducer from "@/features/schedule/slice/scheduleSlice";
import adminDashboardReducer from "@/features/admin-dashboard/slice/adminDashboardSlice";
import employeeDashboardReducer from "@/features/employee-dashboard/slice/employeeDashboardSlice";
import shiftTradeReducer from "@/features/shift-trade/slice/shiftTradeSlice";
import announcementReducer from "@/features/announcement/slice/announcementSlice";
import notificationReducer, {
  handleWebSocketMessage,
} from "@/features/notifications/slice/notificationSlice";
import leaveReducer from "@/features/leave/slice/leaveSlice";
import employeeReducer from "@/features/employee-management/slice/employeeSlice";

import { Action, configureStore, Middleware } from "@reduxjs/toolkit";
import { WebSocketMessage, wsService } from "@/services/websocket";

interface WebSocketAction extends Action {
  type: "notification/connect" | "notification/disconnect";
}

const wsMiddleware: Middleware = (api) => (next) => (action) => {
  const typedAction = action as Action;

  if (isWebSocketAction(typedAction)) {
    const { dispatch } = api;

    switch (typedAction.type) {
      case "notification/connect":
        if (!wsService.isConnected()) {
          wsService.addMessageHandler((message: WebSocketMessage) => {
            dispatch(handleWebSocketMessage(message));
          });
          wsService.connect();
        }
        break;

      case "notification/disconnect":
        wsService.disconnect();
        break;
    }
  }

  return next(action);
};

function isWebSocketAction(action: Action): action is WebSocketAction {
  return (
    action.type === "notification/connect" ||
    action.type === "notification/disconnect"
  );
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    adminDashboard: adminDashboardReducer,
    employeeDashboard: employeeDashboardReducer,
    shiftTrade: shiftTradeReducer,
    announcement: announcementReducer,
    notification: notificationReducer,
    employees: employeeReducer,
    leave: leaveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
