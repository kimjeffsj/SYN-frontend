import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { AdminSchedulePage } from "@/features/schedule/pages/AdminSchedulePage";
import { EmployeeDashboard } from "@/features/employee-dashboard/pages/EmployeeDashboard";
import { AdminDashboard } from "@/features/admin-dashboard/pages/AdminDashboard";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute>
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
    </Provider>
  );
}

export default App;
