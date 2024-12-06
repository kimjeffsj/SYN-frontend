import axios from "axios";
import { LoginCredentials, LoginResponse } from "../types/auth.type";

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  login: async (credential: LoginCredentials) => {
    const formData = new FormData();
    formData.append("username", credential.email);
    formData.append("password", credential.password);

    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      formData
    );
    return response.data;
  },

  logout: async (token: string) => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  },

  getCurrentUser: async (token: string) => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
