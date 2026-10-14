'use client';

import { Megaphone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { AvisoCard } from './AvisoCard';
import type { Aviso, AvisosSectionProps } from './types';

export const initialNotices: Aviso[] = [
  {
    id: 1,
    tag: 'Urgente',
    title: 'Manutenção Preventiva do Forno 01',
    desc: 'Agendada para esta segunda-feira às 06:00 antes da abertura da loja.',
    time: 'Hoje',
  },
  {
    id: 2,
    tag: 'Geral',
    title: 'Novo Padrão de Montagem de Pizzas',
    desc: 'Consultar o manual atualizado na aba de Treinamentos.',
    time: 'Ontem',
  },
  {
    id: 3,
    tag: 'Atenção',
    title: 'Reunião de Alinhamento de Turno',
    desc: 'Sexta-feira às 15:00 na sala de reuniões principal.',
    time: 'Há 2 dias',
  },
];

export default function AvisosSection({
  notices = initialNotices,
}: AvisosSectionProps) {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      aria-labelledby="avisos-section-title"
      className="relative space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm overflow-hidden"
    >
      {/* Conteúdo completo da seção em segundo plano (desfocado e suave) */}
      <div className="space-y-6 filter blur-[5px] opacity-35 select-none pointer-events-none transition-all duration-300">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-inner">
            <Megaphone className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3
              id="avisos-section-title"
              className="text-lg font-black text-slate-900"
            >
              Quadro de Avisos da Imperial Pizza
            </h3>

            <p className="text-xs text-slate-500">
              Comunicados oficiais e avisos importantes para a equipe e colaboradores
            </p>
          </div>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-bold text-slate-700">
              Nenhum aviso disponível
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Os próximos comunicados aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <AvisoCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>

      {/* Overlay com Efeito Blur que cobre a SESSÃO COMPLETA */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/45 backdrop-blur-md">
        {/* Glows de ambient lighting */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-tr from-red-500/20 via-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-16 w-80 h-80 bg-gradient-to-bl from-amber-500/20 via-orange-500/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse"
        />

        {/* Card Glassmorphism de Destaque */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative max-w-xl w-full rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 p-8 sm:p-9 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] space-y-4 ring-1 ring-slate-900/5"
        >
          {/* Ícone com gradiente suave */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-red-600/25">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              Em Constante Evolução
            </span>
          </div>

          {/* Título de contexto */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quadro de Avisos da Imperial Pizza
          </h3>

          {/* Mensagem solicitada */}
          <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed max-w-md mx-auto">
            Nossa equipe está em constante evolução para oferecer a você um atendimento cada vez melhor! Em breve, teremos novidades para melhor servi-lo.
          </p>

          {/* Status animado na base */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Novidades sendo preparadas</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}