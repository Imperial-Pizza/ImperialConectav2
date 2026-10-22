'use client';

import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Layers,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/format';

interface BalancoStatsProps {
  metrics: {
    totalItens: number;
    contadosCount: number;
    pendentesCount: number;
    divergentesCount: number;
    bateuCount: number;
    totalPerdas: number;
    totalSobras: number;
    impactoLiquido: number;
    percentualProgresso: number;
    percentualAcuracia: number;
  };
}

export function BalancoStats({ metrics }: BalancoStatsProps) {
  const {
    totalItens,
    contadosCount,
    pendentesCount,
    divergentesCount,
    bateuCount,
    totalPerdas,
    totalSobras,
    impactoLiquido,
    percentualProgresso,
    percentualAcuracia,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch">
      {/* Card 1: Progresso da Contagem */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title="Progresso da Contagem">
            Progresso
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-200 shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {contadosCount}{' '}
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">/{totalItens}</span>
            </p>
          </div>
          {/* Barra de Progresso Fina */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${percentualProgresso}%` }}
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1 truncate">
            {pendentesCount > 0
              ? `${pendentesCount} pendentes`
              : '100% conferidos'}
          </p>
        </div>
      </div>

      {/* Card 2: Acuracidade do Estoque */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title="Acuracidade do Estoque">
            Acurácia
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
            {formatPercent(percentualAcuracia)}
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${percentualAcuracia}%` }}
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1 truncate">
            {contadosCount > 0
              ? `${bateuCount}/${contadosCount} bateram 100%`
              : 'Inicie contagem'}
          </p>
        </div>
      </div>

      {/* Card 3: Quebras & Desperdício */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate" title="Quebras & Desperdício">
            Quebras
          </span>
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${
              totalPerdas > 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <TrendingDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${totalPerdas > 0 ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        <div>
          <p className="text-lg sm:text-2xl font-black text-red-600 font-mono tracking-tight truncate">
            {totalPerdas > 0 ? `- ${formatCurrency(totalPerdas)}` : 'R$ 0,00'}
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            {divergentesCount > 0
              ? `${divergentesCount} itens c/ diferença`
              : 'Sem quebras'}
          </p>
        </div>
      </div>

      {/* Card 4: Ajuste Líquido no CMV */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow min-h-[110px] sm:min-h-[128px] h-full">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
            Ajuste CMV
          </span>
          <div
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${
              impactoLiquido < 0
                ? 'bg-red-50 text-red-600 border-red-200'
                : impactoLiquido > 0
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div>
          <p
            className={`text-lg sm:text-2xl font-black font-mono tracking-tight truncate ${
              impactoLiquido < 0
                ? 'text-red-600'
                : impactoLiquido > 0
                ? 'text-emerald-600'
                : 'text-slate-900'
            }`}
          >
            {impactoLiquido > 0
              ? `+ ${formatCurrency(impactoLiquido)}`
              : impactoLiquido < 0
              ? `- ${formatCurrency(Math.abs(impactoLiquido))}`
              : 'R$ 0,00'}
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate">
            {totalSobras > 0
              ? `+${formatCurrency(totalSobras)} / -${formatCurrency(totalPerdas)}`
              : 'Impacto no CMV real'}
          </p>
        </div>
      </div>
    </div>
  );
}

