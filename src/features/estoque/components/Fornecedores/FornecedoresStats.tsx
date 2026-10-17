'use client';

import { Building2, CheckCircle2, Clock, Layers } from 'lucide-react';
import type { UseFornecedoresReturn } from '../../hooks/useFornecedores';

interface FornecedoresStatsProps {
  metrics: UseFornecedoresReturn['metrics'];
}

export function FornecedoresStats({ metrics }: FornecedoresStatsProps) {
  const { total, ativos, inativos, categorias } = metrics;

  const stats = [
    {
      label: 'Total de Fornecedores',
      value: total,
      subtext: `${ativos} ativos na rede`,
      icon: Building2,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      label: 'Fornecedores Ativos',
      value: ativos,
      subtext: `${inativos > 0 ? `${inativos} inativos / pausados` : '100% disponíveis'}`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Categorias Atendidas',
      value: categorias,
      subtext: 'Massas, frios, molhos e mais',
      icon: Layers,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      label: 'Prazo Médio de Entrega',
      value: '24h - 48h',
      subtext: 'Logística calibrada',
      icon: Clock,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, subtext, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between gap-3 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title={label}>
              {label}
            </span>
            <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {value}
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              {subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
