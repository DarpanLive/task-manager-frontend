import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-backend-production-2426.up.railway.app/Task-Management/api",  // Added /Task-Management
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor - Add auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      
      // Redirect to login page if not already there
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied. You don't have permission.");
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default API;