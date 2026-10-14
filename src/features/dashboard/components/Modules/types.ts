import type { LucideIcon } from 'lucide-react';

export interface DashboardModule {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: LucideIcon;
  available?: boolean;
  /** Rota da página do módulo, quando ele possui tela própria */
  href?: string;
}

export interface ModulesSectionProps {
  modules?: DashboardModule[];
  onSelectModule: (moduleId: string) => void;
}