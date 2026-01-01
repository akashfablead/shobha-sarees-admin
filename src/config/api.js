import axios from "axios";
import { errorHandler } from "../services/errorHandler";
import { toast } from "sonner";

// Base URLs from environment variables
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// API endpoints
const API = {
  BASE_URL,

  ENDPOINTS: {
    login: "admin/login",
    register: "admin/register",
    profile: "admin/profile",
  },
};

// Axios instance → uses BASE_URL from env or proxy in development
export const apiService = axios.create({
  baseURL: BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor → handle errors globally
apiService.interceptors.response.use(
  (response) => {
    // Optionally show success messages globally when opted-in
    if (response?.config?.showSuccess && response?.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    errorHandler(error); // send to ErrorContext
    return Promise.reject(error);
  }
);
export default API;