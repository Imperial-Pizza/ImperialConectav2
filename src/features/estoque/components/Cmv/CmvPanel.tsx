'use client';

import { motion } from 'framer-motion';
import { DollarSign, Layers, Package, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { formatCurrency, formatPercent } from '../../utils/format';
import { META_CMV } from '../../utils/constants';
import type { UseCmvReturn } from '../../hooks/useCmv';
import type { CmvValores } from '../../types';

interface CmvPanelProps {
  cmv: UseCmvReturn;
}

const INDICADORES: {
  campo: keyof CmvValores;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { campo: 'estoqueInicial', label: 'Estoque Inicial', icon: Layers, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { campo: 'comprasPeriodo', label: 'Compras do Período', icon: TrendingUp, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { campo: 'estoqueFinal', label: 'Estoque Final', icon: Package, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

const CAMPOS: { campo: keyof CmvValores; label: string }[] = [
  { campo: 'estoqueInicial', label: 'Estoque Inicial (R$)' },
  { campo: 'comprasPeriodo', label: 'Compras no Período (R$)' },
  { campo: 'estoqueFinal', label: 'Estoque Final (R$)' },
  { campo: 'faturamentoTotal', label: 'Faturamento Total do Restaurante (R$)' },
];

export function CmvPanel({ cmv }: CmvPanelProps) {
  const { valores, resultado, updateValor } = cmv;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Cálculo de CMV Global (Fórmula Mensal)
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          CMV = Estoque Inicial + Compras do Período - Estoque Final
        </p>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INDICADORES.map(({ campo, label, icon: Icon, color }) => (
          <div key={campo} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-2">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-xl font-black text-slate-900 font-mono">{formatCurrency(valores[campo])}</p>
          </div>
        ))}

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">CMV Apurado</p>
          <p className="text-xl font-black text-red-400 font-mono">{formatCurrency(resultado.cmvGlobal)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulador */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Ajustar Valores Mensais
          </h2>

          <div className="space-y-3">
            {CAMPOS.map(({ campo, label }) => (
              <div key={campo}>
                <label htmlFor={`cmv-${campo}`} className="block text-xs font-bold text-slate-700 mb-1">
                  {label}
                </label>
                <input
                  id={`cmv-${campo}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={valores[campo]}
                  onChange={(e) => updateValor(campo, parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-red-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Resultados e Indicadores
            </h2>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">% do CMV sobre Faturamento:</span>
                <span className="text-sm font-black text-red-600 font-mono">
                  {formatPercent(resultado.cmvPercentual)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Margem de Contribuição Bruta:</span>
                <span className="text-sm font-black text-emerald-600 font-mono">
                  {formatCurrency(resultado.margemContribuicao)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-red-700">Meta Ideal de CMV para Pizzarias:</p>
            <p className="text-[11px] text-red-600 leading-relaxed">
              O ideal para operações de pizzaria saudável fica entre{' '}
              <strong>{META_CMV.min}% e {META_CMV.max}%</strong> do faturamento total.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
