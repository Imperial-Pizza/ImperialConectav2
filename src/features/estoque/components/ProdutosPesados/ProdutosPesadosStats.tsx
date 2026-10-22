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
}

export function ProdutosPesadosStats({ metrics }: ProdutosPesadosStatsProps) {
  const {
    totalItens,
    totalPacotes,
    totalKg,
    lotesBaixos,
    valorTotal,
    rendimentoMedio,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
      {/* Card 1: Peso Total Armazenado */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title="Total Pesado & Pronto">
            Total Pesado
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {totalKg}{' '}
              <span className="text-xs sm:text-sm font-bold text-emerald-600 uppercase">kg</span>
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            Avaliado em <span className="font-bold text-slate-700">{formatCurrency(valorTotal)}</span> de custo
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {formatCurrency(valorTotal)} custo
          </p>
        </div>
      </div>

      {/* Card 2: Lotes / Pacotes Fracionados */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Pacotes Lacrados
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200 shrink-0">
            <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalPacotes}{' '}
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
              {totalPacotes === 1 ? 'pacote' : 'pacotes'}
            </span>
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            Distribuídos em {totalItens} produtos pesados
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {totalItens} produtos
          </p>
        </div>
      </div>

      {/* Card 3: Lotes Abaixo do Mínimo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Reposição Lote
          </span>
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${
              lotesBaixos > 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${lotesBaixos > 0 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-red-600 font-mono tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span>{lotesBaixos}</span>
            <span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase truncate">
              {lotesBaixos === 1 ? 'crítico' : 'críticos'}
            </span>
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            {lotesBaixos > 0
              ? 'Abaixo da meta • Pesar novos lotes'
              : 'Todos os lotes pesados em nível seguro'}
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            {lotesBaixos > 0 ? 'Pesar lotes' : 'Lotes seguros'}
          </p>
        </div>
      </div>

      {/* Card 4: Aproveitamento / Rendimento Médio */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Rendimento
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-amber-50 text-amber-600 border-amber-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <p className="text-lg sm:text-2xl font-black text-amber-600 font-mono tracking-tight">
              {rendimentoMedio}%
            </p>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate">
              aproveitamento
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate hidden sm:block">
            Quebra média controlada em {(100 - rendimentoMedio).toFixed(1)}% no preparo
          </p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate sm:hidden">
            Quebra {(100 - rendimentoMedio).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
