'use client';

import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';

import { useUser } from '@/components/ui/header/hooks/user';

export function WelcomeSection() {
  const { user, isLoading } = useUser();

  if (isLoading || !user) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl h-64 animate-pulse border border-slate-800"></div>
        <div className="bg-white border border-slate-200/80 rounded-3xl h-64 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* =====================================================
          WELCOME BANNER
      ====================================================== */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-800"
      >
        {/* Decorative background */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="space-y-4 relative z-10">

          {/* Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />

            <span>
              Ambiente Operacional Ativo
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Bem-vindo de volta,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              {user.name.split(' ')[0]}
            </span>
            !
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Selecione abaixo o módulo desejado para gerenciar as operações da
            Imperial Pizza com agilidade e total controle em tempo real.
          </p>
        </div>

        {/* Last Access */}
        <div className="pt-6 flex items-center gap-4 text-xs text-slate-400 relative z-10 border-t border-slate-800 mt-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />

            <span>
              Último acesso: {user.lastAccess}
            </span>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          USER PROFILE CARD
      ====================================================== */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
        className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
      >

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-600/20">
            {user.avatar}
          </div>

          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-900 text-sm truncate">
              {user.name}
            </h3>

            <p className="text-[11px] text-slate-500 truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-3 py-3 border-y border-slate-100">

          {/* Role */}
          <div className="text-[11px] text-slate-500 flex flex-col gap-0.5">
            <span className="font-semibold text-slate-400">
              Função:
            </span>

            <span className="font-bold text-slate-800">
              {user.role}
            </span>
          </div>

          {/* Account Status */}
          <div className="text-[11px] text-slate-500 flex justify-between items-center">
            <span className="font-semibold text-slate-400">
              Status da Conta:
            </span>

            <span className="font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

              Ativo
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400">
          Imperial Pizza OS • Painel Administrativo Seguro
        </div>
      </motion.div>
    </div>
  );
}