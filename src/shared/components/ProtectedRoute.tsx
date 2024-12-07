import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { storage } from "../utils/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (!isAuthenticated || !user) {
    const token = storage.getToken();
    const storedUser = storage.getUser();

    if (token && storedUser) {
      return <>{children}</>;
    }
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== "admin") {
    console.log("Not admin, redirecting:", {
      requireAdmin,
      userRole: user.role,
    });

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
