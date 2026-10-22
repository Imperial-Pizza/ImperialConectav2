'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNotifications } from './hooks/notifications';
import { useUser } from './hooks/user';

import {
  Pizza,
  Bell,
  Plus,
  Sparkles,
  Megaphone,
  LogOut,
  User as UserIcon,
  Target,
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

  // Ações opcionais: só aparecem no dropdown quando informadas (ex.: Hub)
  onAddBenefit?: () => void;
  onAddEvent?: () => void;
  onAddNotice?: () => void;

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
  const router = useRouter();

  if (isLoading || !user) {
    return <header className="w-full h-[76px] bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-slate-200/80 flex items-center px-4 sm:px-6"><div className="w-full animate-pulse bg-slate-100 h-10 rounded-xl"></div></header>;
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">

        {/* =====================================================
            BRAND
        ====================================================== */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 min-w-0"
          onClick={onGoToHub}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20 shrink-0">
            <Pizza className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-base sm:text-lg tracking-wider text-slate-900 whitespace-nowrap">
                IMPERIAL
              </span>

              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                PIZZA OS
              </span>
            </div>

            <span className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap block">
              Sistema Integrado de Operações
            </span>
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-3 relative shrink-0">

          {/* =================================================
              BACK TO HUB
          ================================================== */}
          {activeModule !== 'hub' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToHub}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="hidden md:inline">Voltar ao Hub Central</span>
              <span className="md:hidden">Voltar ao Hub</span>
            </motion.button>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                // onToggleNotifications();
              }}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-sm cursor-not-allowed shrink-0"
              style={{ cursor: 'not-allowed' }}
              aria-label="Notificações desativadas"
            >
              <Bell className="w-4 h-4 text-slate-700" />

              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
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
                  className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 overflow-hidden"
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
          <div className="relative shrink-0">
            <button
              onClick={onToggleUserDropdown}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
              style={{ cursor: 'pointer' }}
              aria-label="Abrir menu do usuário"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.avatar}
              </div>

              <span className="text-xs font-bold text-slate-700 max-w-[85px] sm:max-w-none truncate inline">
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
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
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

                  {/* Meu Perfil Completo */}
                  <button
                    onClick={() => {
                      // onToggleUserDropdown();
                      // router.push('/perfil');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
                  >
                    <UserIcon className="w-4 h-4 text-red-600" />

                    <span>
                      Meu Perfil Completo
                    </span>
                  </button>

                  {/* Central de Metas */}
                  <button
                    onClick={() => {
                      // onToggleUserDropdown();
                      // router.push('/metas');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
                  >
                    <Target className="w-4 h-4 text-rose-600" />

                    <span>
                      Central de Metas
                    </span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {/* Add Benefit */}
                  <button
                    onClick={() => {
                      // onAddBenefit?.();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
                  >
                    <Plus className="w-4 h-4 text-red-600" />

                    <span>
                      Adicionar Carrossel Benefício
                    </span>
                  </button>

                  {/* Add Event */}
                  <button
                    onClick={() => {
                      // onAddEvent?.();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />

                    <span>
                      Adicionar Carrossel Evento
                    </span>
                  </button>

                  {/* Add Notice */}
                  <button
                    onClick={() => {
                      // onAddNotice?.();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-not-allowed"
                    style={{ cursor: 'not-allowed' }}
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
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    style={{ cursor: 'pointer' }}
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