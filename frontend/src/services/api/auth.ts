import apiClient from './client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse extends LoginResponse {
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

const extractPayloadError = (error: unknown): Error => {
  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object') {
    const payload = error as Record<string, unknown>;
    if (typeof payload.error === 'string') {
      return new Error(payload.error);
    }
    if (typeof payload.message === 'string') {
      return new Error(payload.message);
    }
  }

  return new Error('Yêu cầu không thể thực hiện. Vui lòng thử lại.');
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw extractPayloadError(error);
    }
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        ...(userData.fullName ? { full_name: userData.fullName } : {}),
      };

      const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw extractPayloadError(error);
    }
  },
};
