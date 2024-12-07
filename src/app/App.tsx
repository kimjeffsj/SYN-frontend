import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { AdminSchedulePage } from "@/features/schedule/pages/AdminSchedulePage";
import { EmployeeDashboard } from "@/features/employee-dashboard/pages/EmployeeDashboard";
import { AdminDashboard } from "@/features/admin-dashboard/pages/AdminDashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { AuthProvider } from "@/features/auth/components/\bAuthProvider";
import { MainLayout } from "@/shared/components/Layout/MainLayout";

function App() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes with Shared Layout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout userRole={user?.role || "employee"}>
                  <Outlet /> {/* 여기에 Outlet 추가 */}
                </MainLayout>
              </ProtectedRoute>
            }
          >
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="schedules" element={<AdminSchedulePage />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="schedule" element={<SchedulePage />} />
          </Route>

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
