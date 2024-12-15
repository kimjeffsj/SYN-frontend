import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "@/app/store";
import { announcementApi } from "../api/announcementApi";
import {
  AnnouncementState,
  CreateAnnouncement,
} from "../types/announcement.type";

const initialState: AnnouncementState = {
  announcements: {
    items: [],
    total: 0,
    unread: 0,
  },
  selectedAnnouncement: null,
  isLoading: false,
  error: null,
};

export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No token found");

      const announcements = await announcementApi.getAnnouncements(token);
      return announcements;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch announcements"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  "announcement/create",
  async (data: CreateAnnouncement, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No token found");

      const announcement = await announcementApi.createAnnouncement(
        token,
        data
      );
      return announcement;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create announcement"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  "announcement/update",
  async (
    { id, data }: { id: number; data: Partial<CreateAnnouncement> },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No token found");

      const announcement = await announcementApi.updateAnnouncement(
        token,
        id,
        data
      );
      return announcement;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to update announcement"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcement/delete",
  async (id: number, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await announcementApi.deleteAnnouncement(token, id);

      dispatch(fetchAnnouncements());
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to delete announcement"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    setSelectedAnnouncement: (state, action) => {
      state.selectedAnnouncement = action.payload;
    },
    clearSelectedAnnouncement: (state) => {
      state.selectedAnnouncement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
        // TODO: come back to fix this type error
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements.items.unshift(action.payload);
        state.announcements.total += 1;
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update announcement
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.items.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.announcements.items[index] = action.payload;
        }
      })
      // Delete announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;

        state.announcements.items = state.announcements.items.filter(
          (announcement) => announcement.id !== action.payload
        );
        state.announcements.total -= 1;
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAnnouncement, clearSelectedAnnouncement } =
  announcementSlice.actions;
export default announcementSlice.reducer;
