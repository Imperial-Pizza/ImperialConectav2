import { perfilApi } from '../apis/perfilApi';
import type { ProfileData, UpdateProfilePayload, UserProfile } from '../types';

/** Carrega usuário logado + perfil completo. */
export async function loadMyProfile(): Promise<ProfileData> {
  const me = await perfilApi.getMe();
  if (!me?.id) throw new Error('Não foi possível identificar o usuário logado.');
  return perfilApi.getProfile(me.id);
}

/**
 * Remove campos vazios antes de enviar: o backend faz merge com `??`,
 * então omitir um campo mantém o valor atual (e evita gravar '' em DATE/TIME).
 */
function sanitizePayload(payload: UpdateProfilePayload): UpdateProfilePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  ) as UpdateProfilePayload;
}

export async function saveMyProfile(userId: number, payload: UpdateProfilePayload): Promise<UserProfile | null> {
  const response = await perfilApi.updateProfile(userId, sanitizePayload(payload));
  return response.profile;
}
