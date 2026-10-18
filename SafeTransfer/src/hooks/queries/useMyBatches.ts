import { useQuery } from '@tanstack/react-query';
import { fileApi } from '../../api/file.api';
import { queryKeys } from '../queryKeys';

export function useMyBatches() {
  return useQuery({
    queryKey: queryKeys.myBatches,
    queryFn: fileApi.getMyBatches,
  });
}
