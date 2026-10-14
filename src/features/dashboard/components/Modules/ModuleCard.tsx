'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

import type { DashboardModule } from './types';

interface ModuleCardProps {
  module: DashboardModule;
  index: number;
  onSelect: (moduleId: string) => void;
}

export function ModuleCard({
  module,
  index,
  onSelect,
}: ModuleCardProps) {
  const Icon = module.icon;
  const isAvailable = module.available ?? (module.id === 'estoque');

  if (!isAvailable) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative flex w-full flex-col justify-between space-y-6 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 text-left shadow-xs select-none cursor-not-allowed opacity-75"
        style={{ cursor: 'not-allowed' }}
        title="Módulo temporariamente indisponível"
        aria-label={`Módulo ${module.name} bloqueado`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${module.color} text-white opacity-60 shadow-xs`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/60 border border-slate-300/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Lock className="w-3 h-3 text-slate-400" />
              Em breve
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-700">
              {module.name}
            </h3>

            <p className="text-xs font-normal leading-relaxed text-slate-400">
              {module.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            Indisponível no momento
          </span>

          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Bloqueado
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(module.id)}
      aria-label={`Acessar módulo ${module.name}`}
      className="group relative flex w-full flex-col justify-between space-y-6 rounded-3xl border border-emerald-200/80 bg-white p-6 text-left shadow-sm transition-all hover:shadow-lg hover:border-emerald-300 hover:shadow-emerald-600/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 cursor-pointer ring-1 ring-emerald-500/10"
      style={{ cursor: 'pointer' }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${module.color} text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-110`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Disponível
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
            {module.name}
          </h3>

          <p className="text-xs font-normal leading-relaxed text-slate-500">
            {module.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-emerald-600">
        <span className="text-emerald-600 group-hover:text-emerald-700">Acessar módulo</span>

        <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}