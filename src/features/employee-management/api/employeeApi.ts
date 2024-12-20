import axios from "axios";
import {
  Employee,
  EmployeeDetail,
  CreateEmployeeDto,
  UpdateEmployeeDto,
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
};
