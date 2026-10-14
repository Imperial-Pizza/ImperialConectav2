'use client';

import { useState } from 'react';

import { Header } from '@/components/ui/header/Header';
import { logout } from '@/components/ui/header/api/auth';

import { WelcomeSection } from './welcome/WelcomeSection';
import BeneficiosSection from './Beneficios/BeneficiosSection';
import ModulesSection from './Modules/ModulesSection';
import EventosSection from './eventos/EventosSection';
import AvisosSection from './Avisos/AvisosSection';
import Footer from './Footer/Footer';

import type { DashboardModule } from './Modules/types';
import type { DashboardEvent, MontadorRanking } from './eventos/types';

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

const modules: DashboardModule[] = [
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

const initialEvents: DashboardEvent[] = [
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

const topMontadores: MontadorRanking[] = [
  { rank: 1, name: 'Mayrlon Sérgio', role: 'Montador', count: '90 pizzas' },
  { rank: 2, name: 'Valeria Souza', role: 'Montador', count: '83 pizzas' },
  { rank: 3, name: 'Italo Sousa', role: 'Montador', count: '79 pizzas' },
  { rank: 4, name: 'Papa Adama', role: 'Montador', count: '66 pizzas' },
  { rank: 5, name: 'Osana Tomás', role: 'Montador', count: '60 pizzas' },
];

export default function DashboardView() {
  const [activeModule, setActiveModule] = useState('hub');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [events] = useState<DashboardEvent[]>(initialEvents);

  const handleLogout = async () => {
    setUserDropdownOpen(false);

    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao encerrar a sessão:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-red-600 selection:text-white">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[20%] top-[10%] h-96 w-96 rounded-full bg-red-600/5 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[10%] right-[20%] h-96 w-96 rounded-full bg-amber-500/5 blur-[140px]"
      />

      {/* Header */}
      <Header
        activeModule={activeModule}
        notificationsOpen={notificationsOpen}
        userDropdownOpen={userDropdownOpen}
        onToggleNotifications={() =>
          setNotificationsOpen((previous) => !previous)
        }
        onToggleUserDropdown={() =>
          setUserDropdownOpen((previous) => !previous)
        }
        onGoToHub={() => setActiveModule('hub')}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-10 px-6 py-8">
        <WelcomeSection />

        <BeneficiosSection />

        <ModulesSection
          modules={modules}
          onSelectModule={setActiveModule}
        />

        <EventosSection
          events={events}
          topMontadores={topMontadores}
        />

        <AvisosSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}