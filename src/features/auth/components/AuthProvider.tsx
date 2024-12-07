// features/auth/components/AuthProvider.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slice/authSlice";
import { storage } from "@/shared/utils/storage";
import { User } from "../types/auth.type";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = storage.getToken();
    const storedUser = storage.getUser() as User | null;

    if (token && storedUser) {
      dispatch(setCredentials({ user: storedUser, token }));

      if (location.pathname === "/") {
        const targetPath =
          storedUser.role === "admin" ? "/admin/dashboard" : "/dashboard";
        navigate(targetPath, { replace: true });
      }
    }
  }, [dispatch, navigate, location.pathname]);

  return <>{children}</>;
};
