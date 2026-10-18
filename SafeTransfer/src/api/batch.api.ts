import apiClient from './axios';
import type { BatchResponse, ModifyRecipientsRequest } from '../types/file.types';

export const batchApi = {
  getBatch: async (batchId: string): Promise<BatchResponse> => {
    const response = await apiClient.get<BatchResponse>(`/api/batch/${batchId}`);
    return response.data;
  },

  addRecipients: async (
    batchId: string,
    data: ModifyRecipientsRequest
  ): Promise<BatchResponse> => {
    const response = await apiClient.post<BatchResponse>(
      `/api/batch/${batchId}/recipients`,
      data
    );
    return response.data;
  },

  replaceRecipients: async (
    batchId: string,
    data: ModifyRecipientsRequest
  ): Promise<BatchResponse> => {
    const response = await apiClient.put<BatchResponse>(
      `/api/batch/${batchId}/recipients`,
      data
    );
    return response.data;
  },

  removeRecipient: async (
    batchId: string,
    recipientId: string
  ): Promise<BatchResponse> => {
    const response = await apiClient.delete<BatchResponse>(
      `/api/batch/${batchId}/recipients/${recipientId}`
    );
    return response.data;
  },
};
