import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth.api';
import type { ChangePasswordRequest } from '../../types/auth.types';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
  });
}
