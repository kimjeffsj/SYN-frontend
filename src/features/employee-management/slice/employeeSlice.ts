import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { employeeApi } from "../api/employeeApi";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  Employee,
  EmployeeDetail,
} from "../types/employee.type";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: EmployeeDetail | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await employeeApi.getEmployees(token);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch employees"
      );
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  "employees/fetchOne",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await employeeApi.getEmployee(token, id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch employee"
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/create",
  async (data: CreateEmployeeDto, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await employeeApi.createEmployee(token, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create employee"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async (
    { id, data }: { id: number; data: UpdateEmployeeDto },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await employeeApi.updateEmployee(token, id, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update employee"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload;
      })

      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = {
            ...state.selectedEmployee,
            ...action.payload,
          };
        }
      });
  },
});

export const { clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
