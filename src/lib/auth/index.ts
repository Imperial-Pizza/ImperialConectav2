export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('imperial_token');
}

export function setToken(token: string): void {
  localStorage.setItem('imperial_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('imperial_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
