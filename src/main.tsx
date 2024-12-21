import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import App from "@/app/App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "@/services/axios-config";

const requestNotificationPermission = async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    } catch {
      console.log("Notification API not supported");
    }
  }
};

requestNotificationPermission();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
