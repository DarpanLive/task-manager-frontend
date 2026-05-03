
// // To this:
// import API from "./api";

// // GET CURRENT USER - GET /api/users/me
// export const getCurrentUser = () => API.get("/users/me");

// // GET ALL USERS - GET /api/users/get-all
// export const getAllUsers = () => API.get("/users/get-all");

import API from "./api";
export const getCurrentUser = () => {
  return API.get("/users/me");
};

export const getAllUsers = () => {
  return API.get("/users/get-all");
};

export const updateUser = (id, data) => {
  return API.put(`/users/update/${id}`, data);
};

export const deleteUser = (id) => {
  return API.delete(`/users/delete/${id}`);
};