'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      className="group flex w-full flex-col justify-between space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
    >
      <div className="space-y-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${module.color} text-white shadow-md shadow-red-600/10 transition-transform group-hover:scale-110`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-red-600">
            {module.name}
          </h3>

          <p className="text-xs font-normal leading-relaxed text-slate-500">
            {module.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-700">
        <span className="text-red-600">Acessar módulo</span>

        <ArrowRight className="h-4 w-4 text-red-600 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}