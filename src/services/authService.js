import api from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, data: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message, errors };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, data: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message, errors };
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, data: user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get user data';
      return { success: false, message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get stored user data
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();