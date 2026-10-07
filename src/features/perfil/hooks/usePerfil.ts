'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadMyProfile, saveMyProfile } from '../services/perfilService';
import type { ProfileData, UpdateProfilePayload } from '../types';

export function usePerfil() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loadMyProfile());
    } catch (err) {
      console.error('Falha ao carregar perfil', err);
      setError(err instanceof Error ? err.message : 'Falha ao carregar perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Retorna true em caso de sucesso. */
  const save = async (payload: UpdateProfilePayload): Promise<boolean> => {
    if (!data) return false;
    setIsSaving(true);
    setError(null);
    try {
      const profile = await saveMyProfile(data.user.id, payload);
      setData({ ...data, profile });
      return true;
    } catch (err) {
      console.error('Falha ao salvar perfil', err);
      setError(err instanceof Error ? err.message : 'Falha ao salvar perfil.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { data, isLoading, isSaving, error, save, reload };
}
