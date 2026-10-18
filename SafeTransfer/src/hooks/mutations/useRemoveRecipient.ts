import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batchApi } from '../../api/batch.api';
import { queryKeys } from '../queryKeys';

interface RemoveRecipientParams {
  batchId: string;
  recipientId: string;
}

export function useRemoveRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, recipientId }: RemoveRecipientParams) =>
      batchApi.removeRecipient(batchId, recipientId),
    onSuccess: (updatedBatch) => {
      queryClient.setQueryData(queryKeys.batch(updatedBatch.id), updatedBatch);
      queryClient.invalidateQueries({ queryKey: queryKeys.myBatches });
    },
  });
}
