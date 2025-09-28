import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API Functions
export const api = {
  // Health check
  health: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Movies
  movies: {
    getFeatured: async () => {
      const response = await apiClient.get('/movies/featured');
      return response.data;
    },
    
    search: async (query, language = 'en-US') => {
      const response = await apiClient.get('/movies/search', {
        params: { q: query, language }
      });
      return response.data;
    },
    
    getDetails: async (movieId) => {
      const response = await apiClient.get(`/movies/${movieId}`);
      return response.data;
    }
  },

  // Reviews 
  reviews: {
    getLatest: async (limit = 10) => {
      const response = await apiClient.get('/reviews/latest', {
        params: { limit }
      });
      return response.data;
    }
  },

  // Subscriptions
  subscriptions: {
    subscribe: async (subscriptionData) => {
      const response = await apiClient.post('/subscriptions/subscribe', subscriptionData);
      return response.data;
    },
    
    quickSubscribe: async (emailData) => {
      const response = await apiClient.post('/subscriptions/quick-subscribe', emailData);
      return response.data;
    },
    
    unsubscribe: async (email) => {
      const response = await apiClient.post('/subscriptions/unsubscribe', null, {
        params: { email }
      });
      return response.data;
    },
    
    sendWeeklyDigest: async () => {
      const response = await apiClient.post('/subscriptions/send-weekly-digest');
      return response.data;
    }
  }
};

export default api;