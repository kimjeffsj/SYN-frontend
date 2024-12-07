import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { AdminSchedulePage } from "@/features/schedule/pages/AdminSchedulePage";
import { EmployeeDashboard } from "@/features/employee-dashboard/pages/EmployeeDashboard";
import { AdminDashboard } from "@/features/admin-dashboard/pages/AdminDashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { AuthProvider } from "@/features/auth/components/\bAuthProvider";

function App() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminSchedulePage />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === "admin" ? "/admin/dashboard" : "/dashboard"
                  }
                  replace
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
