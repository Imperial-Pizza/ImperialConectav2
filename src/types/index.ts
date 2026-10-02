export type UserRole = 'admin' | 'gerente' | 'atendente' | 'cozinheiro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
