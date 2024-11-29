import { RootState } from "@/app/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../componenets/LoginForm";

export const LoginPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white">
      <div className="w-full max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">
            Welcome to SYN
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <LoginForm />

          {/* Contact Manager Notice */}
          <div className="mt-6 pt-6 text-center border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span className="font-semibold text-primary">
                Contact your manager
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SYN. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
