// src/features/perfil/apis/perfilApi.ts

import type { ProfileData, UpdateProfilePayload, UpdateProfileResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('imperial_token') || sessionStorage.getItem('imperial_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const perfilApi = {
  /** GET /api/auth/me — usado para descobrir o id do usuário logado */
  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Erro ao carregar dados do usuário');
    }
    
    const data = await response.json();
    return data.user ?? data;
  },

  /** GET /api/users/{id}/profile */
  getProfile: async (userId: number): Promise<ProfileData> => {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Erro ao carregar perfil');
    }

    return response.json();
  },

  /** PUT /api/users/{id}/profile */
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
};
