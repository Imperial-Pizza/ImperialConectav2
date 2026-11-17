import { forceLogoutAndRedirect, getToken, isTokenExpired } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
  return res.json();
}

// =============================================================================
// Requisições autenticadas (Bearer token salvo no login)
// =============================================================================

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8020/api';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function apiRequest<T>(endpoint: string, { method = 'GET', body }: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getToken();
  if (!token || isTokenExpired(token)) {
    forceLogoutAndRedirect();
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${AUTH_API_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    forceLogoutAndRedirect();
    return new Promise<T>(() => {});
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || `${method} ${endpoint} falhou: ${res.status}`);
  }

  return res.json();
}
