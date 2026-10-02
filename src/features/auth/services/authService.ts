import type { LoginCredentials, AuthResponse } from '../types';

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    token: 'mock-jwt-token',
    user: {
      id: '1',
      name: 'Usuário Imperial',
      email: credentials.email,
      role: 'admin',
    },
  };
}
