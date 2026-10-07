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
        }
      } catch (error) {
        console.error('Failed to load user', error);
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