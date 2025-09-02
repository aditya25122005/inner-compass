// Demo authentication service for development/testing
const DEMO_USER = {
  id: 'demo-admin-123',
  username: 'admin',
  email: 'admin@innercompass.com',
  name: 'Admin User',
  age: 30,
  sex: 'Other',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  mentalScore: 85,
  mood: 'Balanced',
  progressData: {
    mood: 88,
    growth: 82,
    compliance: 75
  },
  activityData: [
    { week: 'Week 1', score: 78 },
    { week: 'Week 2', score: 85 },
    { week: 'Week 3', score: 90 },
    { week: 'Week 4', score: 85 }
  ],
  subscription: {
    plan: 'Pro',
    nextBillingDate: 'September 21, 2025',
    paymentMethod: 'Visa ending in 1234'
  },
  settings: {
    notifications: true,
    darkMode: true
  }
};

const DEMO_TOKEN = 'demo-token-123456';

export const demoAuthAPI = {
  login: async (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          (credentials.emailOrUsername === 'admin' || credentials.emailOrUsername === 'admin@innercompass.com') &&
          credentials.password === '123456'
        ) {
          resolve({
            success: true,
            message: 'Login successful',
            token: DEMO_TOKEN,
            user: DEMO_USER
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid credentials. Use username: admin, password: 123456'
          });
        }
      }, 500); // Simulate network delay
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Registration successful',
          token: DEMO_TOKEN,
          user: {
            ...DEMO_USER,
            ...userData,
            id: 'demo-user-' + Date.now()
          }
        });
      }, 500);
    });
  },

  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: DEMO_USER
        });
      }, 200);
    });
  },

  updateProfile: async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the demo user data
        Object.assign(DEMO_USER, profileData);
        resolve({
          success: true,
          message: 'Profile updated successfully',
          user: DEMO_USER
        });
      }, 500);
    });
  },

  uploadProfilePicture: async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a demo URL for the uploaded file
        const demoUrl = URL.createObjectURL(file);
        DEMO_USER.profilePicture = demoUrl;
        
        resolve({
          success: true,
          message: 'Profile picture uploaded successfully',
          profilePicture: demoUrl,
          user: DEMO_USER
        });
      }, 1000);
    });
  },

  verifyToken: (token) => {
    // Check if token matches demo token
    if (token === DEMO_TOKEN) {
      return DEMO_USER;
    }
    return null;
  }
};

export default demoAuthAPI;
