import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

// Auth API
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

export default api;

const API_BASE_URL = '/api';

export const journalAPI = {
  // Get all journal entries
  getAllEntries: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/journal`);
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      // Return demo data if API fails
      return [
        {
          _id: '1',
          content: 'Today I felt really good about my progress in meditation.',
          mood: 'happy',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          _id: '2',
          content: 'Had some challenges with anxiety, but I managed to work through them.',
          mood: 'anxious',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
        {
          _id: '3',
          content: 'Feeling balanced and centered after my morning routine.',
          mood: 'calm',
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        }
      ];
    }
  },

  // Create a new journal entry
  createEntry: async (content, mood) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, mood }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating journal entry:', error);
      // Return demo response if API fails
      return {
        msg: 'Journal entry saved successfully (demo mode)',
        data: {
          _id: Date.now().toString(),
          content,
          mood,
          createdAt: new Date().toISOString(),
        }
      };
    }
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
