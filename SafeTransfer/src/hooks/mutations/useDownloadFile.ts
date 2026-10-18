import { useMutation } from '@tanstack/react-query';
import { fileApi } from '../../api/file.api';

interface DownloadFileParams {
  fileId: string;
  fileName: string;
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({ fileId, fileName }: DownloadFileParams) => {
      const blob = await fileApi.downloadFile(fileId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return blob;
    },
  });
}
