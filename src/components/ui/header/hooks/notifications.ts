import { useState } from 'react';

export interface Notification {
  id: number;
  title: string;
  time: string;
  desc: string;
}

const initialNotifications: Notification[] = [];

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  return {
    notifications,
    setNotifications,
  };
}