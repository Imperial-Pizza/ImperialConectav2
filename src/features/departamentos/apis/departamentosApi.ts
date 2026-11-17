// src/features/departamentos/apis/departamentosApi.ts

import { forceLogoutAndRedirect, getToken, isTokenExpired } from '@/lib/auth';
import type {
  DepartamentoDetailResponse,
  DepartamentosListResponse,
  DepartamentosStatsResponse,
} from '../types';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8020/api';

function getHeaders(): HeadersInit {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    forceLogoutAndRedirect();
  }

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Application-Key': 'imperial-conecta',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (response.status === 401) {
    forceLogoutAndRedirect();
    // Mantém a Promise pendente enquanto o navegador redireciona para / (evita exibir banner de erro)
    return new Promise<T>(() => {});
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || fallbackMessage);
  }
  return response.json();
}

export const departamentosApi = {
  /** GET /api/departamentos — lista departamentos paginados e com busca */
  listarDepartamentos: async (params?: {
    search?: string;
    page?: number;
    perPage?: number;
  }): Promise<DepartamentosListResponse> => {
    const url = new URL(`${AUTH_API_URL}/departamentos`);
    if (params?.search && params.search.trim() !== '') {
      url.searchParams.set('search', params.search.trim());
    }
    if (params?.page) {
      url.searchParams.set('page', String(params.page));
    }
    if (params?.perPage) {
      url.searchParams.set('perPage', String(params.perPage));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<DepartamentosListResponse>(
      response,
      'Erro ao carregar os departamentos cadastrados.'
    );
  },

  /** GET /api/departamentos/stats — obtém totais de departamentos e colaboradores */
  obterStats: async (): Promise<DepartamentosStatsResponse> => {
    const response = await fetch(`${AUTH_API_URL}/departamentos/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<DepartamentosStatsResponse>(
      response,
      'Erro ao obter estatísticas de departamentos.'
    );
  },

  /** GET /api/departamentos/{id} — obtém detalhes do departamento + lista de colaboradores */
  obterDetalhe: async (id: string): Promise<DepartamentoDetailResponse> => {
    const response = await fetch(`${AUTH_API_URL}/departamentos/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<DepartamentoDetailResponse>(
      response,
      'Erro ao carregar detalhes do departamento.'
    );
  },
};

