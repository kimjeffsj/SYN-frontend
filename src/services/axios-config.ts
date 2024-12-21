import axios from "axios";
import { storage } from "@/shared/utils/storage";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      storage.clearToken();
      storage.clearUser();

      // Redirect to login page
      window.location.href = "/";
      return Promise.reject(new Error("Authentication failed"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
