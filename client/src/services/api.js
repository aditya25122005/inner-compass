import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});


export default API;

export const journalAPI = {
  createEntry: async (text, mood) => {
    const response = await API.post('/journal', { text, mood });
    return response.data;
  },

  getAllEntries: async () => {
    const response = await API.get('/journal'); 
    return response.data;
  },
};


export const taskAPI = {
    // Fetches all tasks for the logged-in user
    getTasks: async () => {
        try {
            const response = await API.get('/tasks'); 
            return response.data;
        } catch (error) {
            console.log("Tasks API Error");
            return []; 
        }
    },

    updateTaskStatus: async (taskId, isCompleted) => {
        const response = await API.put(`/tasks/${taskId}`, { isCompleted }); 
        return response.data;
    },
};

export const dashboardAPI = {
    getDashboardData: async () => {
        const response = await API.get('/dashboard'); 
        return response.data.data;
    },
};