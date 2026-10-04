export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  lastAccess: string;
}

const currentUser: User = {
  name: 'Arthur Guilherme Ribeiro Duarte',
  email: 'arthurnexora@gmail.com',
  role: 'Administrador Geral / Coordenador de Tecnologia',
  avatar: 'A',
  lastAccess: 'Hoje, 14:32',
};

export function useUser() {
  return {
    user: currentUser,
  };
}