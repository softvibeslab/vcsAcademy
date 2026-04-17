/**
 * API Service - VCSA Mobile
 * Servicio centralizado para comunicación con backend
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Agregar token si existe
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          this.clearToken();
          // Aquí podrías redirigir al login
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password
      });

      if (response.data && response.data.user_id) {
        // Guardar token y datos de usuario
        this.setToken(response.data.token || 'demo_token');
        this.setUser(response.data);
        return { success: true, user: response.data };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async register(email, password, name) {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password,
        name
      });

      if (response.data && response.data.user_id) {
        this.setToken(response.data.token || 'demo_token');
        this.setUser(response.data);
        return { success: true, user: response.data };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
      this.clearToken();
      this.clearUser();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      this.clearToken();
      this.clearUser();
      return { success: true }; // Logout local aunque falle el API call
    }
  }

  // Progress tracking methods
  async getProgress() {
    try {
      const response = await this.client.get('/development/progress');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get progress error:', error);
      return { success: false, error: error.message };
    }
  }

  async markContentComplete(contentId) {
    try {
      const response = await this.client.post(`/development/content/${contentId}/complete`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Mark complete error:', error);
      return { success: false, error: error.message };
    }
  }

  // Academy modules methods
  async getAcademyModules() {
    try {
      const response = await this.client.get('/academy/public/bootstrap');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get academy modules error:', error);
      return { success: false, error: error.message };
    }
  }

  // Dashboard methods
  async getDashboardData() {
    try {
      // Simular múltiples llamadas al backend
      const [progressResult, academyResult] = await Promise.all([
        this.getProgress(),
        this.getAcademyModules()
      ]);

      return {
        success: true,
        progress: progressResult.data,
        academy: academyResult.data
      };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Tracks and content
  async getTracks() {
    try {
      const response = await this.client.get('/development/tracks');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get tracks error:', error);
      return { success: false, error: error.message };
    }
  }

  async getTrackContent(trackId) {
    try {
      const response = await this.client.get(`/development/tracks/${trackId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get track content error:', error);
      return { success: false, error: error.message };
    }
  }

  // Quick wins
  async getQuickWins(tag = null) {
    try {
      const url = tag ? `/development/quickwins?tag=${tag}` : '/development/quickwins';
      const response = await this.client.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get quick wins error:', error);
      return { success: false, error: error.message };
    }
  }

  // Deal breakdowns
  async getDealBreakdowns() {
    try {
      const response = await this.client.get('/development/breakdowns');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get deal breakdowns error:', error);
      return { success: false, error: error.message };
    }
  }

  // Token management
  setToken(token) {
    // En producción usar AsyncStorage
    // await AsyncStorage.setItem('auth_token', token);
    this.token = token;
  }

  getToken() {
    // En producción usar AsyncStorage
    // return await AsyncStorage.getItem('auth_token');
    return this.token || null;
  }

  clearToken() {
    this.token = null;
    // await AsyncStorage.removeItem('auth_token');
  }

  setUser(user) {
    this.user = user;
    // await AsyncStorage.setItem('user_data', JSON.stringify(user));
  }

  getUser() {
    return this.user || null;
    // const userData = await AsyncStorage.getItem('user_data');
    // return JSON.parse(userData);
  }

  clearUser() {
    this.user = null;
    // await AsyncStorage.removeItem('user_data');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Health check error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
