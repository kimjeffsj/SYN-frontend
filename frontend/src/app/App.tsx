import { useDispatch } from "react-redux";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { AdminSchedulePage } from "@/features/schedule/pages/AdminSchedulePage";
import { EmployeeDashboard } from "@/features/employee-dashboard/pages/EmployeeDashboard";
import { AdminDashboard } from "@/features/admin-dashboard/pages/AdminDashboard";
import { useEffect } from "react";
import { setCredentials } from "@/features/auth/slice/authSlice";
import { storage } from "@/shared/utils/storage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = storage.getToken();
    const user = storage.getUser();

    if (token && user) {
      dispatch(setCredentials({ user, token }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
