'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../services/authService';
import type { LoginCredentials } from '../types';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginUser(credentials);
      router.push('/dashboard');
    } catch {
      setError('Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
