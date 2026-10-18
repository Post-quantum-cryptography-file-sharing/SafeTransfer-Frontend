import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api/auth.api';
import { queryKeys } from '../queryKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
}
