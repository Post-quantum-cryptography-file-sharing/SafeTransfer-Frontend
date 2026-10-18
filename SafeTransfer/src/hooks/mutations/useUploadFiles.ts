import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileApi, type UploadFilesOptions } from '../../api/file.api';
import { queryKeys } from '../queryKeys';

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: UploadFilesOptions) => fileApi.uploadFiles(options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBatches });
    },
  });
}
