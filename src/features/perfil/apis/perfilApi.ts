// src/features/perfil/apis/perfilApi.ts

import type { ProfileData, UpdateProfilePayload, UpdateProfileResponse } from '../types';

// API unificada KodyVera (Auth + RH)
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8020/api';
// API legada (usada apenas pelo updateProfile até ser migrada)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('imperial_token') || sessionStorage.getItem('imperial_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Application-Key': 'imperial-conecta',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/** Resposta crua de GET /api/auth/me/profile (KodyVera) */
export interface MyProfileApiResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    two_factor_enabled: boolean;
    last_login_at: string | null;
    created_at: string | null;
    password_updated_at: string | null;
    active_sessions: number;
  };
  item: Record<string, any>;
}

export interface TwoFactorSetupResponse {
  success: boolean;
  message: string;
  secret: string;
  qr_code_uri: string;
  backup_codes: string[];
}

export const perfilApi = {
  /** GET /api/auth/me/profile — usuário logado + perfil completo de colaborador */
  getMyProfile: async (): Promise<MyProfileApiResponse> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Erro ao carregar perfil');
    }

    return response.json();
  },

  /** PUT /api/auth/me/profile — atualiza dados do próprio perfil na API unificada KodyVera */
  updateMyProfile: async (payload: Record<string, any>): Promise<MyProfileApiResponse> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Erro ao atualizar perfil');
    }

    return response.json();
  },

  /** PUT /api/users/{id}/profile (legado) */
  updateProfile: async (userId: number, payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Erro ao atualizar perfil');
    }

    return response.json();
  },

  /** POST /api/auth/2fa/setup — gera segredo TOTP, QR Code e códigos de backup */
  setupTwoFactor: async (): Promise<TwoFactorSetupResponse> => {
    const response = await fetch(`${AUTH_API_URL}/auth/2fa/setup`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Erro ao iniciar configuração de 2FA');
    }

    return response.json();
  },

  /** POST /api/auth/2fa/enable — valida o código de 6 dígitos e ativa o 2FA */
  enableTwoFactor: async (code: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${AUTH_API_URL}/auth/2fa/enable`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Código inválido. Verifique seu aplicativo autenticador.');
    }

    return response.json();
  },

  /** POST /api/auth/2fa/disable — desativa o 2FA mediante senha atual */
  disableTwoFactor: async (password: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${AUTH_API_URL}/auth/2fa/disable`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Senha incorreta ou erro ao desativar 2FA.');
    }

    return response.json();
  },

  /** POST /api/auth/change-password — altera a senha do usuário autenticado */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${AUTH_API_URL}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Não foi possível alterar a senha.');
    }

    return response.json();
  },

  /** GET /api/auth/me/bank-accounts — obtém dados bancários e PIX do usuário logado */
  getBankAccounts: async (): Promise<{ success: boolean; items: Record<string, any>[] }> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/bank-accounts`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao carregar dados bancários.');
    }

    return response.json();
  },

  /** POST /api/auth/me/bank-accounts — salva/atualiza dados bancários e PIX */
  saveBankAccount: async (payload: Record<string, any>): Promise<MyProfileApiResponse> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/bank-accounts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao salvar dados bancários.');
    }

    return response.json();
  },

  /** GET /api/auth/me/compensation — obtém parâmetros e histórico de pagamentos */
  getCompensation: async (): Promise<{ success: boolean; items: Record<string, any>[] }> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/compensation`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao carregar parâmetros de pagamento.');
    }

    return response.json();
  },

  /** POST /api/auth/me/compensation — salva parâmetros/histórico de pagamento */
  saveCompensation: async (payload: Record<string, any>): Promise<MyProfileApiResponse> => {
    const response = await fetch(`${AUTH_API_URL}/auth/me/compensation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao salvar parâmetros de pagamento.');
    }

    return response.json();
  },
};
