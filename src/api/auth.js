
// To this:
import API from "./api";

// SIGNUP - POST /api/auth/signup
export const signupUser = (userData) => API.post("/auth/signup", userData);

// LOGIN - POST /api/auth/login
export const loginUser = (credentials) => API.post("/auth/login", credentials);

// LOGOUT - Clear local storage
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
};

// GET CURRENT USER from token
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// GET AUTH TOKEN
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// CHECK IF USER IS ADMIN
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
};