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

import { AdminDashboard } from "@/features/admin-dashboard/pages/AdminDashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { AuthProvider } from "@/features/auth/components/\bAuthProvider";
import { MainLayout } from "@/shared/components/Layout/MainLayout";
import { EmployeeDashboard } from "@/features/employee-dashboard/pages/EmployeeDashboard";
import ShiftTradePage from "@/features/shift-trade/pages/ShiftTradePage";
import AnnouncementsPage from "@/features/announcement/pages/AnnouncementPage";

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

          <Route
            element={
              <ProtectedRoute>
                <MainLayout userRole={user?.role || "employee"}>
                  <Outlet />
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
                    <Route path="trades" element={<ShiftTradePage />} />
                    <Route
                      path="announcements"
                      element={<AnnouncementsPage />}
                    />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="trades" element={<ShiftTradePage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
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
