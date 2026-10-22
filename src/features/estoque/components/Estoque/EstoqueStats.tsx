'use client';

import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Package,
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { UseEstoqueReturn } from '../../hooks/useEstoque';

interface EstoqueStatsProps {
  metrics: UseEstoqueReturn['metrics'];
}

export function EstoqueStats({ metrics }: EstoqueStatsProps) {
  const {
    totalInsumos,
    estoqueBaixo,
    estoqueNormal,
    valorTotal,
    categorias,
    percentualAbastecimento,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
      {/* Card 1: Valor Total em Estoque */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Valor em Estoque
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight truncate">
            {formatCurrency(valorTotal)}
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            Custo total armazenado
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            Custo armazenado
          </p>
        </div>
      </div>

      {/* Card 2: Total de Insumos */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Total de Insumos
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200 shrink-0">
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalInsumos}{' '}
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">itens</span>
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            {categorias} categorias ativas no cardápio
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {categorias} categorias
          </p>
        </div>
      </div>

      {/* Card 3: Estoque Crítico / Baixo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Estoque Baixo
          </span>
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${
              estoqueBaixo > 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${estoqueBaixo > 0 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-red-600 font-mono tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span>{estoqueBaixo}</span>
            <span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase truncate">
              {estoqueBaixo === 1 ? 'crítico' : 'críticos'}
            </span>
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            {estoqueBaixo > 0
              ? 'Necessitam reposição imediata'
              : 'Nenhum insumo em nível crítico'}
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {estoqueBaixo > 0 ? 'Repor logo' : 'Nível normal'}
          </p>
        </div>
      </div>

      {/* Card 4: Nível de Abastecimento Geral */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate"
            title="Nível de Abastecimento Geral"
          >
            Abastecimento
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-indigo-50 text-indigo-600 border-indigo-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-indigo-600 font-mono tracking-tight">
            {percentualAbastecimento}%
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            {estoqueNormal} de {totalInsumos} insumos em nível regular
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {estoqueNormal}/{totalInsumos} regulares
          </p>
        </div>
      </div>
    </div>
  );
}
