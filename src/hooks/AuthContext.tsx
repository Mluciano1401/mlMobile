import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { SecureStorage } from '@/storage/secureStorage';
import { setUnauthorizedHandler } from '@/services/httpClient';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    await SecureStorage.clearToken();
    setToken(null);
  }, []);

  const signIn = useCallback(async (newToken: string) => {
    await SecureStorage.saveToken(newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });

    (async () => {
      const stored = await SecureStorage.getToken();
      setToken(stored);
      setIsLoading(false);
    })();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
