import {
  Employee,
  EmployeeDetail,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  DepartmentResponse,
  PositionResponse,
} from "../types/employee.type";
import axiosInstance from "@/services/axios-config";

const API_URL = import.meta.env.VITE_API_URL;

export const employeeApi = {
  getEmployees: async (
    token: string,
    params?: {
      skip?: number;
      limit?: number;
      search?: string;
    }
  ) => {
    const response = await axiosInstance.get<Employee[]>(
      `${API_URL}/admin/employees`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  },

  getEmployee: async (token: string, id: number) => {
    const response = await axiosInstance.get<EmployeeDetail>(
      `${API_URL}/admin/employees/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  createEmployee: async (token: string, data: CreateEmployeeDto) => {
    const response = await axiosInstance.post<Employee>(
      `${API_URL}/admin/employees`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  updateEmployee: async (
    token: string,
    id: number,
    data: UpdateEmployeeDto
  ) => {
    const response = await axiosInstance.patch<Employee>(
      `${API_URL}/admin/employees/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getDepartments: async (token: string) => {
    try {
      const response = await axiosInstance.get<DepartmentResponse[]>(
        `${API_URL}/admin/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch {
      throw new Error("Failed to fetch departments");
    }
  },

  getPositions: async (token: string) => {
    try {
      const response = await axiosInstance.get<PositionResponse[]>(
        `${API_URL}/admin/positions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch {
      throw new Error("Failed to fetch positions");
    }
  },

  addDepartment: async (token: string, name: string) => {
    try {
      const response = await axiosInstance.post<DepartmentResponse>(
        `${API_URL}/admin/departments`,
        {
          name: name,
          description: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.name;
    } catch (error) {
      console.error("Failed to add department:", error);
      throw error;
    }
  },

  addPosition: async (token: string, name: string) => {
    try {
      const response = await axiosInstance.post<PositionResponse>(
        `${API_URL}/admin/positions`,
        {
          name: name,
          description: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.name;
    } catch (error) {
      console.error("Failed to add position:", error);
      throw error;
    }
  },
};
