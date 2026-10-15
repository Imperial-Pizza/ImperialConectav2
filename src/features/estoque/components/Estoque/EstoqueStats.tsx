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
  apenasBaixo: boolean;
  onToggleApenasBaixo: () => void;
}

export function EstoqueStats({
  metrics,
  apenasBaixo,
  onToggleApenasBaixo,
}: EstoqueStatsProps) {
  const {
    totalInsumos,
    estoqueBaixo,
    estoqueNormal,
    valorTotal,
    categorias,
    percentualAbastecimento,
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Valor Total em Estoque */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Valor em Estoque
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(valorTotal)}
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Custo total de produtos armazenados
          </p>
        </div>
      </div>

      {/* Card 2: Total de Insumos */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total de Insumos
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalInsumos}{' '}
            <span className="text-xs font-bold text-slate-400 uppercase">itens</span>
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {categorias} categorias ativas no cardápio
          </p>
        </div>
      </div>

      {/* Card 3: Estoque Crítico / Baixo (Interativo) */}
      <button
        type="button"
        onClick={onToggleApenasBaixo}
        title="Clique para filtrar apenas os insumos com estoque baixo"
        className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 text-left transition-all cursor-pointer ${
          apenasBaixo
            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 shadow-md'
            : 'border-slate-200/90 hover:border-red-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Estoque Baixo
            </span>
            {apenasBaixo && (
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-red-600 text-white">
                Filtro Ativo
              </span>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${
              estoqueBaixo > 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${estoqueBaixo > 0 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-red-600 font-mono tracking-tight flex items-center gap-2">
            <span>{estoqueBaixo}</span>
            <span className="text-xs font-bold text-red-400 uppercase">
              {estoqueBaixo === 1 ? 'item crítico' : 'itens críticos'}
            </span>
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {estoqueBaixo > 0
              ? apenasBaixo
                ? 'Mostrando críticos • Clique p/ limpar'
                : 'Necessitam reposição • Clique p/ filtrar'
              : 'Nenhum insumo em falta no momento'}
          </p>
        </div>
      </button>

      {/* Card 4: Nível de Abastecimento Geral */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Abastecimento Geral
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-indigo-50 text-indigo-600 border-indigo-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-indigo-600 font-mono tracking-tight">
            {percentualAbastecimento}%
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {estoqueNormal} de {totalInsumos} insumos em nível regular
          </p>
        </div>
      </div>
    </div>
  );
}
