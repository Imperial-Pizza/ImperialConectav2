// src/features/estoque/apis/estoqueApi.ts

import type { Insumo, NovoInsumo } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('imperial_token') ||
    sessionStorage.getItem('imperial_token')
  );
}

function headers(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || fallback);
  }
  return response.json();
}

export const estoqueApi = {
  listarInsumos: async (): Promise<Insumo[]> => {
    const response = await fetch(`${API_URL}/estoque/insumos`, {
      headers: headers(),
    });
    return handle<Insumo[]>(response, 'Erro ao carregar insumos');
  },

  criarInsumo: async (insumo: NovoInsumo): Promise<Insumo> => {
    const response = await fetch(`${API_URL}/estoque/insumos`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(insumo),
    });
    return handle<Insumo>(response, 'Erro ao cadastrar insumo');
  },
};
