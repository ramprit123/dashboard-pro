'use client';

import { useAuthSession } from '@/components/providers/session-provider';

export function useAuth() {
  const { user, session, isLoading } = useAuthSession();

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
  };
}
