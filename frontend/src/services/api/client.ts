import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '@/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://f891bfc38254.ngrok-free.app';
const DEFAULT_API_TIMEOUT = 120000;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_API_TIMEOUT) || DEFAULT_API_TIMEOUT;

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true"
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('fluxmare_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('fluxmare_token');
          window.location.href = '/';
        }
        
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new APIClient().getInstance();
export default apiClient;
