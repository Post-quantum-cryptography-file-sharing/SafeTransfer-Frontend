import apiClient from './axios';
import type { UserSummary } from '../types/user.types';

export const userApi = {
  searchUsers: async (query: string): Promise<UserSummary[]> => {
    const response = await apiClient.get<UserSummary[]>('/api/user/search', {
      params: { query },
    });
    return response.data;
  },
};
