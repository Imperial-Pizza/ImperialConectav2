'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { EventCarousel } from './EventCarousel';
import { TopMontadores } from './TopMontadores';
import { initialEvents, topMontadores as defaultTopMontadores } from './mock';

import type { EventosSectionProps } from './types';

export default function EventosSection({
  events = initialEvents,
  topMontadores = defaultTopMontadores,
}: EventosSectionProps) {
  return (
    <section
      aria-label="Eventos e ranking de montadores"
      className="relative rounded-3xl overflow-hidden pt-2"
    >
      {/* Conteúdo completo da seção em segundo plano (desfocado e suave) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 filter blur-[5px] opacity-35 select-none pointer-events-none transition-all duration-300">
        <EventCarousel events={events} />

        <TopMontadores montadores={topMontadores} />
      </div>

      {/* Overlay com Efeito Blur que cobre a SESSÃO COMPLETA */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/45 backdrop-blur-md rounded-3xl border border-slate-200/80">
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
            Eventos & Ranking de Montadores
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
    </section>
  );
}