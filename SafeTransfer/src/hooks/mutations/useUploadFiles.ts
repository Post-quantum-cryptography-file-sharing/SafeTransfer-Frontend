import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileApi } from '../../api/file.api';
import { queryKeys } from '../queryKeys';
import type { UploadFilesRequest } from '../../types/file.types';

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadFilesRequest) => fileApi.uploadFiles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBatches });
    },
  });
}
