import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/user.api';
import { queryKeys } from '../queryKeys';

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.userSearch(query),
    queryFn: () => userApi.searchUsers(query),
    enabled: query.length >= 2,
  });
}
