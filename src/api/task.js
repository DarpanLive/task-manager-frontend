

// To this:
import API from "./api";

// CREATE TASK - POST /api/tasks/add
export const createTask = (data) => API.post("/tasks/add", data);

// GET ALL TASKS with filters - GET /api/tasks/get-all
export const getTasks = (status, priority, assignedUserId, pageable) => {
  const params = {};
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (assignedUserId) params.assignedUserId = assignedUserId;
  if (pageable) {
    if (pageable.page !== undefined) params.page = pageable.page;
    if (pageable.size !== undefined) params.size = pageable.size;
    if (pageable.sort) params.sort = pageable.sort;
  }
  return API.get("/tasks/get-all", { params });
};

// GET TASK BY ID - GET /api/tasks/get-by/{id}
export const getTaskById = (id) => API.get(`/tasks/get-by/${id}`);

// UPDATE TASK - PUT /api/tasks/update/${id}
export const updateTask = (id, data) => API.put(`/tasks/update/${id}`, data);

// UPDATE TASK STATUS - PATCH /api/tasks/update/${id}/status
export const updateTaskStatus = (id, status) => 
  API.patch(`/tasks/update/${id}/status`, { status });

// DELETE TASK - DELETE /api/tasks/delete/${id}
export const deleteTask = (id) => API.delete(`/tasks/delete/${id}`);