import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ChatbotAPI {
  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/chatbot`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token (disabled for testing)
this.client.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('accessToken');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send a message to the chatbot
   * @param {string} message - User message
   * @returns {Promise} - Promise containing the conversation response
   */
  async sendMessage(message) {
    try {
      const response = await this.client.post('/chat', { message });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  }

  /**
   * Get chat history with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 50)
   * @returns {Promise} - Promise containing chat history
   */
  async getChatHistory(page = 1, limit = 50) {
    try {
      const response = await this.client.get(`/history?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch chat history',
      };
    }
  }

  /**
   * Clear all chat history
   * @returns {Promise} - Promise containing deletion result
   */
  async clearChatHistory() {
    try {
      const response = await this.client.delete('/history');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to clear chat history',
      };
    }
  }

  /**
   * Analyze mood from a message
   * @param {string} message - Message to analyze
   * @returns {Promise} - Promise containing mood analysis
   */
  async analyzeMood(message) {
    try {
      const response = await this.client.post('/analyze-mood', { message });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to analyze mood',
      };
    }
  }

  /**
   * Generate a journal prompt
   * @param {string} topic - Optional topic for the prompt
   * @returns {Promise} - Promise containing journal prompt
   */
  async generateJournalPrompt(topic = null) {
    try {
      const url = topic ? `/journal-prompt?topic=${encodeURIComponent(topic)}` : '/journal-prompt';
      const response = await this.client.get(url);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate journal prompt',
      };
    }
  }

  /**
   * Get chatbot health status
   * @returns {Promise} - Promise containing health status
   */
  async getHealthStatus() {
    try {
      const response = await this.client.get('/health');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get health status',
      };
    }
  }

  /**
   * Get chatbot usage statistics
   * @returns {Promise} - Promise containing usage stats
   */
  async getStats() {
    try {
      const response = await this.client.get('/stats');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get statistics',
      };
    }
  }
}

// Create and export a singleton instance
const chatbotAPI = new ChatbotAPI();
export default chatbotAPI;
