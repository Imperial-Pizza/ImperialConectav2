'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { X } from 'lucide-react';
import { Header } from '@/components/ui/header/Header';
import { logout } from '@/components/ui/header/api/auth';
import { Portal } from '@/components/ui/Portal';

interface AppShellProps {
  /** Identificador do módulo atual (exibe "Voltar ao Hub" quando diferente de 'hub') */
  activeModule: string;
  children: React.ReactNode;
}

/**
 * Casca padrão das páginas internas (fora do Hub):
 * Header global + área de conteúdo + footer.
 */
export function AppShell({ activeModule, children }: AppShellProps) {
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Modals state for adding items via dropdown
  const [showAddBenefitModal, setShowAddBenefitModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);

  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newBenefitDesc, setNewBenefitDesc] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddBenefitModal(false);
    setNewBenefitTitle('');
    setNewBenefitDesc('');
    // Aqui seria integrada uma chamada de API global ou Context
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddEventModal(false);
    setNewEventTitle('');
    setNewEventDesc('');
    // Aqui seria integrada uma chamada de API global ou Context
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddNoticeModal(false);
    setNewNoticeTitle('');
    setNewNoticeDesc('');
    // Aqui seria integrada uma chamada de API global ou Context
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between relative overflow-x-clip">
      <Header
        activeModule={activeModule}
        notificationsOpen={notificationsOpen}
        userDropdownOpen={userDropdownOpen}
        onToggleNotifications={() => {
          setNotificationsOpen((open) => !open);
          setUserDropdownOpen(false);
        }}
        onToggleUserDropdown={() => {
          setUserDropdownOpen((open) => !open);
          setNotificationsOpen(false);
        }}
        onGoToHub={() => router.push('/dashboard')}
        onLogout={handleLogout}
        onAddBenefit={() => {
          setUserDropdownOpen(false);
          setShowAddBenefitModal(true);
        }}
        onAddEvent={() => {
          setUserDropdownOpen(false);
          setShowAddEventModal(true);
        }}
        onAddNotice={() => {
          setUserDropdownOpen(false);
          setShowAddNoticeModal(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 relative">
        {children}
      </main>

      <footer className="w-full border-t border-slate-200/80 bg-white py-4 sm:py-6 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-1 shadow-inner">
        <p className="font-bold text-slate-700">IMPERIAL PIZZA • SISTEMA DE OPERAÇÕES V4.0</p>
        <p>© 2026 Imperial Pizza. Todos os direitos reservados.</p>
      </footer>

      {/* Modal: Adicionar Benefício */}
      {showAddBenefitModal && (
        <Portal>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Adicionar Benefício ao Carrossel</h3>
              <form onSubmit={handleAddBenefit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Benefício</label>
                  <input 
                    type="text" 
                    value={newBenefitTitle} 
                    onChange={(e) => setNewBenefitTitle(e.target.value)}
                    placeholder="Ex: Entrega Expressa" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                  <textarea 
                    value={newBenefitDesc} 
                    onChange={(e) => setNewBenefitDesc(e.target.value)}
                    placeholder="Explique o benefício..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBenefitModal(false)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Adicionar</button>
                </div>
              </form>
            </motion.div>
          </div>
        </Portal>
      )}

      {/* Modal: Adicionar Evento */}
      {showAddEventModal && (
        <Portal>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Adicionar Evento à Programação</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Evento</label>
                  <input 
                    type="text" 
                    value={newEventTitle} 
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Ex: Workshop de Massas" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                  <textarea 
                    value={newEventDesc} 
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Detalhes do evento..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEventModal(false)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Adicionar Evento</button>
                </div>
              </form>
            </motion.div>
          </div>
        </Portal>
      )}

      {/* Modal: Adicionar Aviso no Quadro */}
      {showAddNoticeModal && (
        <Portal>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Adicionar Novo Aviso</h3>
              <form onSubmit={handleAddNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título do Aviso</label>
                  <input 
                    type="text" 
                    value={newNoticeTitle} 
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="Ex: Reunião de Equipe" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensagem</label>
                  <textarea 
                    value={newNoticeDesc} 
                    onChange={(e) => setNewNoticeDesc(e.target.value)}
                    placeholder="Conteúdo do aviso..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNoticeModal(false)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Publicar Aviso</button>
                </div>
              </form>
            </motion.div>
          </div>
        </Portal>
      )}
    </div>
  );
}
