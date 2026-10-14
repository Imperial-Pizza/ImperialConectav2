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

export default function DashboardView() {
  const [activeModule, setActiveModule] = useState('hub');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
          onSelectModule={setActiveModule}
        />

        <EventosSection />

        <AvisosSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}