// src/features/auth/apis/authApi.ts
// Integração com a API unificada KodyVera (Auth + RH): http://localhost:8020/api

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8020/api';

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  requires_2fa?: boolean;
  temp_token?: string;
  token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id: number | string;
    name: string;
    email: string;
    role: string;
    roles?: string[];
    permissions?: string[];
    colaborador?: unknown;
  };
}

async function extractError(response: Response, fallback: string): Promise<string> {
  const data = await response.json().catch(() => null);
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (typeof first === 'string') return first;
  }
  return data?.message || data?.error || fallback;
}

export const authApi = {
  login: async (email: string, password: string, remember = false): Promise<LoginApiResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password, remember }),
    });

    if (!response.ok) {
      throw new Error(await extractError(response, 'Erro ao realizar login'));
    }

    const data = await response.json();

    // Conta com 2FA ativo: a API devolve um token temporário para a segunda etapa
    if (data?.requires_2fa && data?.temp_token) {
      return data;
    }

    if (!data?.token) {
      throw new Error('Resposta inválida do servidor de autenticação.');
    }

    return data;
  },

  verifyTwoFactor: async (tempToken: string, code: string): Promise<LoginApiResponse> => {
    const response = await fetch(`${API_URL}/auth/2fa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ temp_token: tempToken, code }),
    });

    if (!response.ok) {
      throw new Error(await extractError(response, 'Código 2FA inválido ou expirado.'));
    }

    const data = await response.json();

    if (!data?.token) {
      throw new Error('Resposta inválida do servidor de autenticação.');
    }

    return data;
  },

  loginWithGoogle: async (accessToken: string): Promise<LoginApiResponse> => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
      throw new Error(await extractError(response, 'Erro ao realizar login com Google'));
    }

    return response.json();
  },
};
