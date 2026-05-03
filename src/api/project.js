
import API from "./api";

// GET ALL PROJECTS
export const getProjects = () => 
  API.get("/projects/get-all");

// GET PROJECT BY ID
export const getProjectById = (id) => 
  API.get(`/projects/get-by/${id}`);

// CREATE PROJECT
export const createProject = (data) => 
  API.post("/projects/add", data);

// UPDATE PROJECT
export const updateProject = (id, data) => 
  API.put(`/projects/update/${id}`, data);

// DELETE PROJECT
export const deleteProject = (id) => 
  API.delete(`/projects/delete/${id}`);

// ADD MEMBER TO PROJECT
export const addMemberToProject = (projectId, userId) => 
  API.post(`/projects/add/${projectId}/members/${userId}`);