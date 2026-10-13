'use client';

import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

import { AvisoCard } from './AvisoCard';
import type { AvisosSectionProps } from './types';

export default function AvisosSection({
  notices,
}: AvisosSectionProps) {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      aria-labelledby="avisos-section-title"
      className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
    >
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
    </motion.section>
  );
}