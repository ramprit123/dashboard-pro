// Simple auth implementation for testing
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User;
  expires: string;
}

// Mock auth functions for testing
export const simpleAuth = {
  signIn: async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
    // Simple validation
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    // Mock user
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };

    return { user };
  },

  signUp: async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ user?: User; error?: string }> => {
    // Simple validation
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' };
    }

    // Mock user creation
    const user: User = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
    };

    return { user };
  },

  signOut: async (): Promise<void> => {
    // Clear session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-session');
    }
  },

  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null;

    const session = localStorage.getItem('auth-session');
    if (!session) return null;

    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  setSession: (user: User): void => {
    if (typeof window === 'undefined') return;

    const session: Session = {
      user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    localStorage.setItem('auth-session', JSON.stringify(session));
  },
};
