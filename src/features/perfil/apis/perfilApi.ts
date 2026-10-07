// src/features/perfil/apis/perfilApi.ts

import { apiRequest } from '@/lib/api';
import type { ProfileData, UpdateProfilePayload, UpdateProfileResponse } from '../types';

export const perfilApi = {
  /** GET /api/auth/me — usado para descobrir o id do usuário logado */
  getMe: async () => {
    const data = await apiRequest<{ user?: { id: number } } & { id?: number }>('/auth/me');
    return data.user ?? data;
  },

  /** GET /api/users/{id}/profile */
  getProfile: (userId: number) => apiRequest<ProfileData>(`/users/${userId}/profile`),

  /** PUT /api/users/{id}/profile */
  updateProfile: (userId: number, payload: UpdateProfilePayload) =>
    apiRequest<UpdateProfileResponse>(`/users/${userId}/profile`, {
      method: 'PUT',
      body: payload,
    }),
};
