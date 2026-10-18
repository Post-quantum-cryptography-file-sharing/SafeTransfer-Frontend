import apiClient from './axios';
import type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  UserResponse,
} from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/api/auth/register', data);
  },

  login: async (data: LoginRequest): Promise<void> => {
    await apiClient.post('/api/auth/login', data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/api/auth/change-password', data);
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/api/auth/me');
    return response.data;
  },
};
