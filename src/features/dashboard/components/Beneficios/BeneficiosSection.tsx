
'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Package,
  DollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Modelo de dados dos benefícios.
 */
interface Beneficio {
  id: number;
  title: string;
  desc: string;
  gradient: string;
  icon: LucideIcon;
}

/**
 * Seção de benefícios do dashboard Imperial Pizza.
 *
 * Responsabilidades:
 * - Gerenciar os dados dos benefícios.
 * - Controlar a rolagem horizontal.
 * - Renderizar os cards com animações.
 * - Exibir um estado vazio caso não existam benefícios.
 */
export default function BeneficiosSection() {
  // Dados dos benefícios
  const [benefits] = useState<Beneficio[]>([
    {
      id: 1,
      title: 'Atendimento Ágil',
      desc: 'Foco total na experiência com comandas digitais e suporte contínuo.',
      gradient: 'from-blue-600 via-indigo-600 to-violet-600',
      icon: UtensilsCrossed,
    },
    {
      id: 2,
      title: 'KDS & Forno Inteligente',
      desc: 'Controle de tempo de forno e produção de pizzas em tempo real.',
      gradient: 'from-red-600 via-rose-600 to-orange-500',
      icon: ChefHat,
    },
    {
      id: 3,
      title: 'Gestão de Estoque',
      desc: 'Rastreabilidade completa de insumos, massas e fornecedores.',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      icon: Package,
    },
    {
      id: 4,
      title: 'Controle Financeiro',
      desc: 'Caixa diário, relatórios detalhados e faturamento automatizado.',
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      icon: DollarSign,
    },
  ]);

  // Referência do container horizontal
  const benefitsScrollRef = useRef<HTMLDivElement>(null);

  // Navegação horizontal dos benefícios
  const scrollBenefits = (direction: 'left' | 'right') => {
    const container = benefitsScrollRef.current;

    if (!container) return;

    const distance = Math.min(container.clientWidth * 0.8, 400);

    container.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm overflow-hidden"
      aria-labelledby="beneficios-heading"
    >
      {/* Conteúdo completo da seção em segundo plano (desfocado e suave) */}
      <div className="space-y-6 filter blur-[5px] opacity-35 select-none pointer-events-none transition-all duration-300">
        {/* Cabeçalho da seção */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-block text-[10px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
              React Bits Showcase
            </span>

            <h2
              id="beneficios-heading"
              className="text-xl font-black text-slate-900 tracking-tight mt-1"
            >
              Pilares da Excelência Operacional
            </h2>
          </div>

          {/* Botões de navegação */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled
              aria-label="Ver benefícios anteriores"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              disabled
              aria-label="Ver próximos benefícios"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista horizontal de benefícios */}
        <div
          ref={benefitsScrollRef}
          className="flex gap-5 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
          role="list"
          aria-label="Pilares da excelência operacional"
        >
          {benefits.map((item) => {
            const IconComp = item.icon ?? Sparkles;

            return (
              <div
                key={item.id}
                role="listitem"
                className={`min-w-[320px] sm:min-w-[380px] h-44 rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden shrink-0`}
              >
                {/* Efeito decorativo de luz */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"
                />

                {/* Ícone e selo */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <IconComp
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Destaque
                  </span>
                </div>

                {/* Conteúdo do benefício */}
                <div className="space-y-1 relative z-10">
                  <h3 className="text-lg font-black tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
            Pilares da Excelência Operacional
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
