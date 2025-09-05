import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post('/auth/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMentalScore: async (mentalScore) => {
    const response = await api.put('/auth/mental-score', { mentalScore });
    return response.data;
  }
};

export const journalAPI = {
  getAllEntries: async () => {
    const response = await api.get('/journal');
    return response.data;
  },

  createEntry: async (content, mood) => {
    const response = await api.post('/journal', { content, mood });
    return response.data;
  }
};

export const demoData = {
  userProfile: {
    age: 29,
    sex: 'Female',
    mentalScore: 72,
    userId: 'demo-user-123'
  },
  
  mentalStatus: {
    score: 72,
    status: 'Balanced',
    percentage: 72
  },
  
  progress: {
    mood: 85,
    growth: 70,
    compliance: 60
  },
  
  activity: {
    weeklyData: [
      { week: 'Week 1', score: 65 },
      { week: 'Week 2', score: 70 },
      { week: 'Week 3', score: 78 },
      { week: 'Week 4', score: 72 }
    ]
  }
};

export default api;
