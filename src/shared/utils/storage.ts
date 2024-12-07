import { User } from "@/features/auth/types/auth.type";

export const storage = {
  getToken: (): string | null => localStorage.getItem("token"),
  setToken: (token: string): void => localStorage.setItem("token", token),
  clearToken: (): void => localStorage.removeItem("token"),

  getUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  },
  setUser: (user: User): void =>
    localStorage.setItem("user", JSON.stringify(user)),
  clearUser: (): void => localStorage.removeItem("user"),
};
