
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
      className="space-y-4 pt-2"
      aria-labelledby="beneficios-heading"
    >
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
            onClick={() => scrollBenefits('left')}
            aria-label="Ver benefícios anteriores"
            title="Benefícios anteriores"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollBenefits('right')}
            aria-label="Ver próximos benefícios"
            title="Próximos benefícios"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista horizontal de benefícios */}
      <div
        ref={benefitsScrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
        role="list"
        aria-label="Pilares da excelência operacional"
      >
        {benefits.map((item) => {
          const IconComp = item.icon ?? Sparkles;

          return (
            <motion.article
              key={item.id}
              role="listitem"
              whileHover={{ y: -4 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
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
            </motion.article>
          );
        })}

        {/* Estado vazio */}
        {benefits.length === 0 && (
          <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />

            <p className="text-sm font-semibold text-slate-700">
              Nenhum benefício cadastrado
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Os pilares da excelência operacional aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
