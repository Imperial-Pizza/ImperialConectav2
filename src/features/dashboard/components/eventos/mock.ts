import type { DashboardEvent, MontadorRanking } from './types';

export const initialEvents: DashboardEvent[] = [
  {
    id: 1,
    title: 'Treinamento de Forno',
    desc: 'Capacitação avançada da equipe de montagem.',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Aniversário da Loja',
    desc: 'Comemoração oficial com clientes e parceiros.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Sexta Musical',
    desc: 'Noite de música ao vivo na Imperial Pizza.',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
  },
];

export const topMontadores: MontadorRanking[] = [
  { rank: 1, name: 'Mayrlon Sérgio', role: 'Montador', count: '90 pizzas' },
  { rank: 2, name: 'Valeria Souza', role: 'Montador', count: '83 pizzas' },
  { rank: 3, name: 'Italo Sousa', role: 'Montador', count: '79 pizzas' },
  { rank: 4, name: 'Papa Adama', role: 'Montador', count: '66 pizzas' },
  { rank: 5, name: 'Osana Tomás', role: 'Montador', count: '60 pizzas' },
];
