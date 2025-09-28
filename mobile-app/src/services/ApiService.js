import axios from 'axios';
import Constants from 'expo-constants';

// Use environment variable for API URL
const BASE_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`📱 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response.data;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async getHealth() {
    return await this.api.get('/health');
  }

  // Movies
  async getFeaturedMovies() {
    return await this.api.get('/movies/featured');
  }

  async searchMovies(query, language = 'en-US') {
    return await this.api.get('/movies/search', {
      params: { q: query, language }
    });
  }

  async getMovieDetails(movieId) {
    return await this.api.get(`/movies/${movieId}`);
  }

  // Reviews
  async getLatestReviews(limit = 10) {
    return await this.api.get('/reviews/latest', {
      params: { limit }
    });
  }

  async getReviewById(reviewId) {
    return await this.api.get(`/reviews/${reviewId}`);
  }

  // Subscriptions
  async subscribeToNewsletter(emailData) {
    return await this.api.post('/subscriptions/quick-subscribe', emailData);
  }

  async createSubscription(subscriptionData) {
    return await this.api.post('/subscriptions/subscribe', subscriptionData);
  }

  // Error handling helper
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data.detail || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Please check your internet connection');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
}

export default new ApiService();