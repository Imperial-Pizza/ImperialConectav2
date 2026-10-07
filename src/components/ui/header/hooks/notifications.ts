import { useState } from 'react';

export interface Notification {
  id: number;
  title: string;
  time: string;
  desc: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Atualização do KDS v4.2',
    time: 'Há 10 min',
    desc: 'Melhorias de desempenho no tempo de forno e comandas.',
  },
  {
    id: 2,
    title: 'Fechamento de Caixa',
    time: 'Há 1 hora',
    desc: 'Caixa diário encerrado com sucesso pelo gerente de turno.',
  },
  {
    id: 3,
    title: 'Novo Insumo Cadastrado',
    time: 'Há 3 horas',
    desc: 'Farinha especial italiana adicionada ao estoque principal.',
  },
];

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  return {
    notifications,
    setNotifications,
  };
}