import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Package,
  DollarSign,
  BarChart3,
  FileText,
  Fingerprint,
  Settings,
} from 'lucide-react';

import type { DashboardModule } from './types';

export const modules: DashboardModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    desc: 'Visão geral da operação e KPIs em tempo real',
    icon: LayoutDashboard,
    color: 'from-red-600 to-amber-500',
  },
  {
    id: 'atendimento',
    name: 'Atendimento',
    desc: 'Gestão de mesas, salão e comandas ativas',
    icon: UtensilsCrossed,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    desc: 'KDS, produção de pizzas e controle de forno',
    icon: ChefHat,
    color: 'from-red-700 to-red-500',
  },
  {
    id: 'estoque',
    name: 'Estoque',
    desc: 'Controle de massas, insumos e fornecedores',
    icon: Package,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    desc: 'Caixa diário, relatórios de vendas e faturamento',
    icon: DollarSign,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    desc: 'Indicadores gerenciais e métricas avançadas',
    icon: BarChart3,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'logs',
    name: 'Logs do Sistema',
    desc: 'Auditoria de acessos e histórico de ações operacionais',
    icon: FileText,
    color: 'from-indigo-700 to-slate-800',
  },
  {
    id: 'ponto',
    name: 'Batida de Ponto',
    desc: 'Controle de jornada e registro de ponto da equipe',
    icon: Fingerprint,
    color: 'from-teal-600 to-emerald-700',
  },
  {
    id: 'administracao',
    name: 'Administração',
    desc: 'Configurações do sistema, usuários e permissões',
    icon: Settings,
    color: 'from-slate-700 to-slate-900',
  },
];

export const initialModules = modules;
