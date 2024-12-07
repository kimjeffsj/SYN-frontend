import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "@/app/store";
import { setCredentials } from "@/features/auth/slice/authSlice";
import { storage } from "@/shared/utils/storage";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token = storage.getToken();
    const storedUser = storage.getUser();

    if (token && storedUser) {
      dispatch(setCredentials({ user: storedUser, token }));
    } else if (!isAuthenticated && location.pathname !== "/") {
      navigate("/", { replace: true });
    } else if (isAuthenticated && location.pathname === "/") {
      const targetPath =
        storedUser?.role === "admin" ? "/admin/dashboard" : "/dashboard";
      navigate(targetPath, { replace: true });
    }
  }, [dispatch, isAuthenticated, navigate, location.pathname]);

  const getDefaultRoute = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  return { user, isAuthenticated, getDefaultRoute };
};
