import { useState, useEffect } from 'react';
import { getMe } from '../api/auth';
import {
  forceLogoutAndRedirect,
  getToken,
  getTokenExpirationMs,
  isTokenExpired,
} from '@/lib/auth';

export interface User {
  name: string;
  email: string;
  role: string;
  sector?: string;
  avatar: string;
  lastAccess: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    // Se não houver token ou já estiver expirado, desloga imediatamente
    if (!token || isTokenExpired(token)) {
      forceLogoutAndRedirect();
      return;
    }

    // Agenda o deslogue automático exatamente quando o tempo do JWT acabar
    let expiryTimeout: ReturnType<typeof setTimeout> | null = null;
    const expMs = getTokenExpirationMs(token);
    if (expMs !== null) {
      const remainingMs = Math.max(0, expMs - Date.now());
      expiryTimeout = setTimeout(() => {
        forceLogoutAndRedirect();
      }, remainingMs);
    }

    async function loadUser() {
      try {
        const data = await getMe();
        if (data) {
          setUser(data);
        } else {
          setUser({
            name: 'Arthur',
            email: 'arthur@imperialpizza.com.br',
            role: 'Administrador',
            avatar: 'A',
            lastAccess: 'Agora',
          });
        }
      } catch (error) {
        console.warn('Could not load user profile, using fallback:', error);
        setUser({
          name: 'Arthur',
          email: 'arthur@imperialpizza.com.br',
          role: 'Administrador',
          avatar: 'A',
          lastAccess: 'Agora',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();

    return () => {
      if (expiryTimeout) clearTimeout(expiryTimeout);
    };
  }, []);

  return {
    user,
    isLoading,
  };
}