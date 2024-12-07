import { User } from "@/features/auth/types/auth.type";

export const storage = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  clearToken: () => localStorage.removeItem("token"),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => localStorage.setItem("user", JSON.stringify(user)),
  clearUser: () => localStorage.removeItem("user"),
};
