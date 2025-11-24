import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for refresh token
});

// Request interceptor to add token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token available
          console.warn('No refresh token available');
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed - only clear and redirect if it's a critical auth error
        console.error('Token refresh failed:', refreshError);
        // Don't auto-redirect, let the component handle it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;export const journalAPI = {
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