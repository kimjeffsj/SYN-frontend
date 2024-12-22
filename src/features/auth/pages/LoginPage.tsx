import { RootState } from "@/app/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  // Demo credentials
  const demoAdmin = {
    email: "admin@demo.com",
    password: "demo1234",
  };

  const demoEmployee = {
    email: "john.doe@demo.com",
    password: "demo1234",
  };

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

          {/* Demo Account Buttons */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Try Demo Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  document.dispatchEvent(
                    new CustomEvent("demo-login", {
                      detail: demoAdmin,
                    })
                  )
                }
                className="w-full px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                Try as Admin
              </button>
              <button
                onClick={() =>
                  document.dispatchEvent(
                    new CustomEvent("demo-login", {
                      detail: demoEmployee,
                    })
                  )
                }
                className="w-full px-4 py-2 text-secondary border-2 border-secondary rounded-lg hover:bg-secondary/5 transition-colors text-sm font-medium"
              >
                Try as Employee
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-2">
              Demo accounts are pre-filled with sample data for testing purposes
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
