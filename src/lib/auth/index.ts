let isRedirectingToLogin = false;

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('imperial_token') ||
    sessionStorage.getItem('imperial_token')
  );
}

export function setToken(token: string, remember = true): void {
  if (typeof window === 'undefined') return;
  if (remember) {
    localStorage.setItem('imperial_token', token);
  } else {
    sessionStorage.setItem('imperial_token', token);
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('imperial_token');
  sessionStorage.removeItem('imperial_token');
}

/**
 * Decodifica o payload do JWT (sem verificar assinatura) para ler o timestamp `exp`.
 */
export function getTokenExpirationMs(token?: string | null): number | null {
  const raw = token ?? getToken();
  if (!raw) return null;

  try {
    const parts = raw.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));

    if (typeof payload?.exp === 'number') {
      return payload.exp * 1000;
    }
    return null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token?: string | null): boolean {
  const raw = token ?? getToken();
  if (!raw) return true;

  const expMs = getTokenExpirationMs(raw);
  if (expMs === null) return false;
  return Date.now() >= expMs;
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Limpa a sessão e redireciona imediatamente para a tela de login (`/`),
 * garantindo que erros de autenticação expirada não fiquem visíveis na tela.
 */
export function forceLogoutAndRedirect(): void {
  if (typeof window === 'undefined') return;
  clearToken();

  if (window.location.pathname === '/') return;
  if (isRedirectingToLogin) return;

  isRedirectingToLogin = true;
  window.location.replace('/');
}
