import { useQuery } from '@tanstack/react-query';
import { batchApi } from '../../api/batch.api';
import { queryKeys } from '../queryKeys';

export function useBatch(batchId: string) {
  return useQuery({
    queryKey: queryKeys.batch(batchId),
    queryFn: () => batchApi.getBatch(batchId),
    enabled: !!batchId,
  });
}
