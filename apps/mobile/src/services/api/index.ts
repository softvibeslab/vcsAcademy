import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../config/api';

// API Configuration
const API_BASE_URL = API_ENDPOINTS.mobile;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if exists
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear the local token.
          await AsyncStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.session_token) {
      await AsyncStorage.setItem('auth_token', response.data.session_token);
    }
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
  }

  // AI Coach endpoints
  async generateCoachingResponse(input: any) {
    const response = await this.client.post('/ai/coach', input);
    return response.data;
  }

  // Quick Wins endpoints
  async getQuickWins(filters?: any) {
    const params = filters ? new URLSearchParams(filters as any) : '';
    const response = await this.client.get(`/quick-wins?${params}`);
    return response.data;
  }

  async toggleFavorite(quickWinId: string) {
    const response = await this.client.post(`/quick-wins/${quickWinId}/favorite`);
    return response.data;
  }

  // Performance endpoints
  async getReadinessScore() {
    const response = await this.client.get('/performance/readiness');
    return response.data;
  }

  async getDailyGoal() {
    const response = await this.client.get('/performance/daily-goal');
    return response.data;
  }

  async recordTourResult(result: any) {
    const response = await this.client.post('/performance/tour', result);
    return response.data;
  }

  // Sync endpoint
  async syncOfflineContent() {
    const response = await this.client.get('/sync/content');
    return response.data;
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request(config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
