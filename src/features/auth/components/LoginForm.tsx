import React, { useState } from "react";
import { LoginCredentials } from "../types/auth.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { login } from "../slice/authSlice";
import { LogIn } from "lucide-react";

export const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = await dispatch(login(credentials)).unwrap();

      if (action.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6 w-full max-w-sm mx-auto px-4 md:px-0"
    >
      {error && (
        <div className="p-2 md:p-3 text-xs md:text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs md:text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          className="w-full border rounded-lg p-2 md:p-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs md:text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          className="w-full border rounded-lg p-2 md:p-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-3 w-3 md:h-4 md:w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-xs md:text-sm text-gray-600"
          >
            Remember me
          </label>
        </div>
        <button
          type="button"
          className="text-xs md:text-sm font-medium text-primary hover:text-primary/90"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-2 md:py-2.5 px-4 rounded-lg text-sm md:text-base text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign in
          </>
        )}
      </button>
    </form>
  );
};
