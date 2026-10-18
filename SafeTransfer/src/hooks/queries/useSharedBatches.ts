import { useQuery } from '@tanstack/react-query';
import { fileApi } from '../../api/file.api';
import { queryKeys } from '../queryKeys';

export function useSharedBatches() {
  return useQuery({
    queryKey: queryKeys.sharedBatches,
    queryFn: fileApi.getSharedBatches,
  });
}
