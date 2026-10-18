import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useCurrentUser } from '../hooks/queries/useCurrentUser';
import type { UserResponse } from '../types/auth.types';

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isPending, refetch, isSuccess } = useCurrentUser();

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: isPending,
      isAuthenticated: isSuccess && !!user,
      refetchUser: refetch,
    }),
    [user, isPending, isSuccess, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
