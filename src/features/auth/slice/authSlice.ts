import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials } from "../types/auth.type";
import { authApi } from "../api/authApi";
import { AxiosError } from "axios";
import { storage } from "@/shared/utils/storage";
import { RootState } from "@/app/store";

const initialState: AuthState = {
  user: storage.getUser(),
  accessToken: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      storage.setToken(data.access_token);

      const user = await authApi.getCurrentUser(data.access_token);
      storage.setUser(data.access_token);
      return { token: data.access_token, user };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.detail || "Login failed");
      }
      return rejectWithValue("Unexpected error, try again");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, dispatch }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        await authApi.logout(token);
      }

      dispatch(logout());
      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);

      dispatch(logout());
      window.location.href = "/";
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      storage.clearToken();
      storage.clearUser();
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.accessToken = token;
      state.isAuthenticated = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
