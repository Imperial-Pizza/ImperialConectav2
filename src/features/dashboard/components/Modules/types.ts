import type { LucideIcon } from 'lucide-react';

export interface DashboardModule {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: LucideIcon;
}

export interface ModulesSectionProps {
  modules?: DashboardModule[];
  onSelectModule: (moduleId: string) => void;
}