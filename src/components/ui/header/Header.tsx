'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from './hooks/notifications';
import { useUser } from './hooks/user';

import {
  Pizza,
  Bell,
  Plus,
  Sparkles,
  Megaphone,
  LogOut,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface HeaderProps {
  activeModule: string;

  notificationsOpen: boolean;
  userDropdownOpen: boolean;

  onToggleNotifications: () => void;
  onToggleUserDropdown: () => void;

  onGoToHub: () => void;

  onAddBenefit: () => void;
  onAddEvent: () => void;
  onAddNotice: () => void;

  onLogout?: () => void;
}

export function Header({
  activeModule,
  notificationsOpen,
  userDropdownOpen,
  onToggleNotifications,
  onToggleUserDropdown,
  onGoToHub,
  onAddBenefit,
  onAddEvent,
  onAddNotice,
  onLogout,
}: HeaderProps) {
  const { notifications } = useNotifications();
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return <header className="w-full h-[76px] bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-slate-200/80 flex items-center px-6"><div className="w-full animate-pulse bg-slate-100 h-10 rounded-xl"></div></header>;
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* =====================================================
            BRAND
        ====================================================== */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onGoToHub}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <Pizza className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-slate-900">
                IMPERIAL
              </span>

              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                PIZZA OS
              </span>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Sistema Integrado de Operações
            </span>
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}
        <div className="flex items-center gap-4 relative">

          {/* =================================================
              BACK TO HUB
          ================================================== */}
          {activeModule !== 'hub' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToHub}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2"
            >
              <span>Voltar ao Hub Central</span>
            </motion.button>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}
          <div className="relative">
            <button
              onClick={onToggleNotifications}
              className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-sm"
              aria-label="Abrir notificações"
            >
              <Bell className="w-4 h-4 text-slate-700" />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 overflow-hidden"
                >
                  {/* Notifications Header */}
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Atualizações Recentes
                    </p>

                    <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200">
                      {notifications.length} novas
                    </span>
                  </div>

                  {/* Notifications List */}
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-slate-50 transition-colors space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900">
                              {notification.title}
                            </p>

                            <span className="text-[10px] text-slate-400">
                              {notification.time}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {notification.desc}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-slate-400">
                          Nenhuma notificação nova.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              USER DROPDOWN
          ================================================== */}
          <div className="relative">
            <button
              onClick={onToggleUserDropdown}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              aria-label="Abrir menu do usuário"
            >
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                {user.avatar}
              </div>

              <span className="text-xs font-bold text-slate-700">
                {user.name.split(' ')[0]}
              </span>

              <span className="text-slate-400 text-[10px]">
                ▼
              </span>
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                >
                  {/* User Information */}
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">
                      {user.name}
                    </p>

                    <p className="text-[10px] text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Add Benefit */}
                  <button
                    onClick={onAddBenefit}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-red-600" />

                    <span>
                      Adicionar Carrossel Benefício
                    </span>
                  </button>

                  {/* Add Event */}
                  <button
                    onClick={onAddEvent}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />

                    <span>
                      Adicionar Carrossel Evento
                    </span>
                  </button>

                  {/* Add Notice */}
                  <button
                    onClick={onAddNotice}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Megaphone className="w-4 h-4 text-blue-600" />

                    <span>
                      Novo Aviso
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-1" />

                  {/* Logout */}
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />

                    <span>
                      Deslogar
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}