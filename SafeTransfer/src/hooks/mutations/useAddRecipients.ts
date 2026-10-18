import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batchApi } from '../../api/batch.api';
import { queryKeys } from '../queryKeys';
import type { ModifyRecipientsRequest } from '../../types/file.types';

interface AddRecipientsParams {
  batchId: string;
  data: ModifyRecipientsRequest;
}

export function useAddRecipients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, data }: AddRecipientsParams) =>
      batchApi.addRecipients(batchId, data),
    onSuccess: (updatedBatch) => {
      queryClient.setQueryData(queryKeys.batch(updatedBatch.id), updatedBatch);
      queryClient.invalidateQueries({ queryKey: queryKeys.myBatches });
    },
  });
}
