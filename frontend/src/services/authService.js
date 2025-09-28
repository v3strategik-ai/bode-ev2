import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://notify-mesh.preview.emergentagent.com';

class AuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/messenger`;
    
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('messenger_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('messenger_token');
          localStorage.removeItem('messenger_user');
          window.location.reload(); // Force re-authentication
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData) {
    try {
      const response = await this.api.post('/register', {
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        password: userData.password,
        avatar_url: userData.avatar_url || null
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/login', {
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  async getProfile(token) {
    try {
      const response = await this.api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  }

  async updateStatus(status, token) {
    try {
      const response = await this.api.put('/status', 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Update status API error:', error);
      throw error;
    }
  }

  // Utility method to get current token
  getToken() {
    return localStorage.getItem('messenger_token');
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = localStorage.getItem('messenger_user');
    return !!(token && user);
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('messenger_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();