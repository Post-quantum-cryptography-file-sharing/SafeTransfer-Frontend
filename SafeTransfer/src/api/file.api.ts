import apiClient from './axios';
import type { BatchResponse, SharedBatchResponse, UploadFilesRequest } from '../types/file.types';

export interface UploadFilesOptions {
  data: UploadFilesRequest;
  onProgress?: (progress: number) => void;
}

export const fileApi = {
  uploadFiles: async ({ data, onProgress }: UploadFilesOptions): Promise<BatchResponse> => {
    const formData = new FormData();

    data.files.forEach((file) => {
      formData.append('Files', file);
    });
    formData.append('Title', data.title);
    formData.append('ExpiresAt', data.expiresAt);
    data.recipientIds.forEach((id) => {
      formData.append('RecipientIds', id);
    });
    data.recipientEmails.forEach((email) => {
      formData.append('RecipientEmails', email);
    });

    const response = await apiClient.post<BatchResponse>('/api/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  getMyBatches: async (): Promise<BatchResponse[]> => {
    const response = await apiClient.get<BatchResponse[]>('/api/file');
    return response.data;
  },

  getSharedBatches: async (): Promise<SharedBatchResponse[]> => {
    const response = await apiClient.get<SharedBatchResponse[]>('/api/file/shared');
    return response.data;
  },

  downloadFile: async (fileId: string): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`/api/file/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
