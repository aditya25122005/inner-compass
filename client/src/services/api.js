import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Automatically attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

/* --------------------- AUTH --------------------- */
export const authAPI = {
  updateProfile: async (data) => {
    const response = await API.put("/auth/profile", data);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await API.post("/auth/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

/* -------------------- JOURNAL -------------------- */
export const journalAPI = {
  createEntry: async (text, mood) => {
    const response = await API.post("/journal", { text, mood });
    return response.data;
  },

  getAllEntries: async () => {
    const response = await API.get("/journal");
    return response.data;
  },
    getEntries: async (params = {}) => {
    // params: { page, limit, q, mood, dateFrom, dateTo }
    const response = await API.get("/journal/history", { params });
    return response.data;
  },
};

/* ---------------------- TASKS ---------------------- */
export const taskAPI = {
  getTasks: async () => {
    const response = await API.get("/tasks");
    return response.data;
  },

  getSeparatedTasks: async () => {
    const response = await API.get("/tasks/separate");
    return response.data;
  },

  updateTaskStatus: async (taskId, isCompleted) => {
    const response = await API.put(`/tasks/${taskId}`, { isCompleted });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await API.delete(`/tasks/${taskId}`);
    return response.data;
  },
};


/* -------------------- DASHBOARD -------------------- */
export const dashboardAPI = {
  getDashboardData: async () => {
    const response = await API.get("/dashboard");
    return response.data.data;
  },
};
