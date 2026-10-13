export interface DashboardEvent {
  id: string | number;
  title: string;
  desc: string;
  image: string;
}

export interface MontadorRanking {
  rank: number;
  name: string;
  role: string;
  count: number | string;
}

export interface EventosSectionProps {
  events: DashboardEvent[];
  topMontadores: MontadorRanking[];
}