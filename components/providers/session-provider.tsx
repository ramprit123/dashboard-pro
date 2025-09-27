'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { simpleAuth, User, Session } from '@/lib/simple-auth';

interface SessionContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const existingSession = simpleAuth.getSession();
    setSession(existingSession);
    setIsLoading(false);

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      const newSession = simpleAuth.getSession();
      setSession(newSession);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user: session?.user || null,
        session,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within a SessionProvider');
  }
  return context;
}
