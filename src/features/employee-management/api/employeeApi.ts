import axios from "axios";
import {
  Employee,
  EmployeeDetail,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  DepartmentResponse,
  PositionResponse,
} from "../types/employee.type";

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
    const response = await axios.get<Employee[]>(`${API_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  getEmployee: async (token: string, id: number) => {
    const response = await axios.get<EmployeeDetail>(
      `${API_URL}/admin/employees/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  createEmployee: async (token: string, data: CreateEmployeeDto) => {
    const response = await axios.post<Employee>(
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
    const response = await axios.patch<Employee>(
      `${API_URL}/admin/employees/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getDepartments: async (token: string) => {
    try {
      const response = await axios.get<DepartmentResponse[]>(
        `${API_URL}/admin/departments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
      }
      throw error;
    }
  },

  getPositions: async (token: string) => {
    try {
      const response = await axios.get<PositionResponse[]>(
        `${API_URL}/admin/positions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
      throw error;
    }
  },

  addDepartment: async (token: string, name: string) => {
    try {
      const response = await axios.post<DepartmentResponse>(
        `${API_URL}/admin/departments`,
        {
          name: name,
          description: null, // PositionCreate 스키마에 맞춰서 전송
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
      const response = await axios.post<PositionResponse>(
        `${API_URL}/admin/positions`,
        {
          name: name,
          description: null, // PositionCreate 스키마에 맞춰서 전송
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
