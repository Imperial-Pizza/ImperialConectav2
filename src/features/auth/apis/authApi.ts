// src/features/auth/apis/authApi.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Erro ao realizar login');
    }

    return response.json();
  },

  loginWithGoogle: async (googleToken: string) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ token: googleToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Erro ao realizar login com Google');
    }

    return response.json();
  }
};
