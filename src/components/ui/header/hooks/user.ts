import { useState, useEffect } from 'react';
import { getMe } from '../api/auth';

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
    async function loadUser() {
      try {
        const data = await getMe();
        if (data) {
          setUser(data);
        } else {
          // Fallback padrão para exibição suave do Header
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
  }, []);

  return {
    user,
    isLoading,
  };
}