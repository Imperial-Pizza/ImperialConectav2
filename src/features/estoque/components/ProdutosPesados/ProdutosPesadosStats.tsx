'use client';

import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Flame,
  Scale,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { UseProdutosPesadosReturn } from '../../hooks/useProdutosPesados';

interface ProdutosPesadosStatsProps {
  metrics: UseProdutosPesadosReturn['metrics'];
  apenasBaixo: boolean;
  onToggleApenasBaixo: () => void;
}

export function ProdutosPesadosStats({
  metrics,
  apenasBaixo,
  onToggleApenasBaixo,
}: ProdutosPesadosStatsProps) {
  const {
    totalItens,
    totalPacotes,
    totalKg,
    lotesBaixos,
    valorTotal,
    rendimentoMedio,
  } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Peso Total Armazenado */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Pesado & Pronto
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {totalKg}{' '}
              <span className="text-sm font-bold text-emerald-600 uppercase">kg</span>
            </p>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Avaliado em <span className="font-bold text-slate-700">{formatCurrency(valorTotal)}</span> de custo
          </p>
        </div>
      </div>

      {/* Card 2: Lotes / Pacotes Fracionados */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pacotes Lacrados
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalPacotes}{' '}
            <span className="text-xs font-bold text-slate-400 uppercase">
              {totalPacotes === 1 ? 'pacote' : 'pacotes'}
            </span>
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Distribuídos em {totalItens} produtos pesados
          </p>
        </div>
      </div>

      {/* Card 3: Lotes Abaixo do Mínimo (Interativo) */}
      <button
        type="button"
        onClick={onToggleApenasBaixo}
        title="Clique para filtrar apenas os produtos pesados abaixo do estoque mínimo"
        className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 text-left transition-all cursor-pointer ${
          apenasBaixo
            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 shadow-md'
            : 'border-slate-200/90 hover:border-red-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Reposição de Lote
            </span>
            {apenasBaixo && (
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-red-600 text-white">
                Filtro Ativo
              </span>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${
              lotesBaixos > 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${lotesBaixos > 0 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div>
          <p className="text-2xl font-black text-red-600 font-mono tracking-tight flex items-center gap-2">
            <span>{lotesBaixos}</span>
            <span className="text-xs font-bold text-red-400 uppercase">
              {lotesBaixos === 1 ? 'item crítico' : 'itens críticos'}
            </span>
          </p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {lotesBaixos > 0
              ? apenasBaixo
                ? 'Mostrando críticos • Clique p/ limpar'
                : 'Abaixo da meta • Pesar novos lotes'
              : 'Todos os lotes pesados em nível seguro'}
          </p>
        </div>
      </button>

      {/* Card 4: Aproveitamento / Rendimento Médio */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Rendimento Médio
          </span>
          <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-amber-50 text-amber-600 border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-amber-600 font-mono tracking-tight">
              {rendimentoMedio}%
            </p>
            <span className="text-[10px] font-bold text-slate-400">
              aproveitamento
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Quebra média controlada em {(100 - rendimentoMedio).toFixed(1)}% no preparo
          </p>
        </div>
      </div>
    </div>
  );
}
