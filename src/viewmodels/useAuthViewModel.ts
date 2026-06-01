import { useState, useCallback } from 'react';
import { AuthRepository } from '@/repositories/authRepository';
import { useAuth } from '@/hooks/AuthContext';
import { validateLogin, validateUserForm } from '@/utils/validators';
import { CreateUserDTO } from '@/models/User';

export function useAuthViewModel() {
  const { signIn, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);
      const errors = validateLogin(email, password);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return false;

      setIsLoading(true);
      try {
        const { token } = await AuthRepository.login({ email, password });
        await signIn(token);
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [signIn],
  );

  const register = useCallback(
    async (dto: CreateUserDTO): Promise<boolean> => {
      setError(null);
      const errors = validateUserForm(dto.name, dto.email, dto.password);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return false;

      setIsLoading(true);
      try {
        await AuthRepository.register(dto);
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return { isLoading, error, fieldErrors, login, register, logout };
}
