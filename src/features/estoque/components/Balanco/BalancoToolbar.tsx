'use client';

import {
  AlertCircle,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  LayoutGrid,
  LayoutList,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CATEGORIAS_INSUMO, FILTRO_TODAS } from '../../utils/constants';
import type { EstoqueViewMode, FiltroBalancoStatus } from '../../types';

interface BalancoToolbarProps {
  search: string;
  categoria: string;
  statusFilter: FiltroBalancoStatus;
  viewMode: EstoqueViewMode;
  contadosCount: number;
  divergentesCount: number;
  bateuCount: number;
  pendentesCount: number;
  temContagens: boolean;
  onSearchChange: (val: string) => void;
  onCategoriaChange: (val: string) => void;
  onStatusFilterChange: (status: FiltroBalancoStatus) => void;
  onViewModeChange: (mode: EstoqueViewMode) => void;
  onPreencherComSaldoAtual: () => void;
  onLimparContagem: () => void;
  onOpenFinalizarModal: () => void;
  onOpenHistoricoModal: () => void;
}

export function BalancoToolbar({
  search,
  categoria,
  statusFilter,
  viewMode,
  contadosCount,
  divergentesCount,
  bateuCount,
  pendentesCount,
  temContagens,
  onSearchChange,
  onCategoriaChange,
  onStatusFilterChange,
  onViewModeChange,
  onPreencherComSaldoAtual,
  onLimparContagem,
  onOpenFinalizarModal,
  onOpenHistoricoModal,
}: BalancoToolbarProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Seção 1: Cabeçalho com Título e Ações Principais */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Balanço & Inventário Físico
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 tracking-wide uppercase">
              Auditoria
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Confronte a contagem física com o sistema, identifique quebras e balanceie os saldos reais em tempo real
          </p>
        </div>

        {/* Botões de Ação no Padrão Imperial */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHistoricoModal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Histórico</span>
          </button>

          <button
            type="button"
            onClick={onPreencherComSaldoAtual}
            title="Preenche a contagem de todos os insumos com o valor registrado no sistema"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Copiar Saldos</span>
          </button>

          {temContagens && (
            <button
              type="button"
              onClick={onLimparContagem}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              title="Limpar contagens físicas digitadas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar</span>
            </button>
          )}

          {/* Botão Principal no Vermelho Imperial */}
          <button
            type="button"
            disabled={contadosCount === 0}
            onClick={onOpenFinalizarModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-red-600/25 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4" />
            <span>Finalizar Balanço ({contadosCount})</span>
          </button>
        </div>
      </div>

      {/* Linha Divisória */}
      <div className="border-t border-slate-100" />

      {/* Seção 2: Linha de Busca, Categorias e Modos de Visualização */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, código ou categoria..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dropdown de Categorias */}
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => onCategoriaChange(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value={FILTRO_TODAS}>Todas as Categorias</option>
              {CATEGORIAS_INSUMO.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Seletor de Modo de Visualização (Cards vs Tabela Compacta) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Visualização em Lista de Auditoria"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              title="Visualização em Grade de Cards"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção 3: Pills de Filtro de Situação */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          FILTROS:
        </span>

        {/* Todos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('todos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'todos'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>Todos</span>
        </button>

        {/* Divergentes (Falta ou Sobra) */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('divergentes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'divergentes'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Com Divergência</span>
          {divergentesCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusFilter === 'divergentes' ? 'bg-white text-red-600' : 'bg-red-200 text-red-800'
              }`}
            >
              {divergentesCount}
            </span>
          )}
        </button>

        {/* Bateu 100% */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('bateu')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'bateu'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Bateu (OK)</span>
          {bateuCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusFilter === 'bateu' ? 'bg-white text-emerald-600' : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {bateuCount}
            </span>
          )}
        </button>

        {/* Pendentes */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('pendentes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pendentes'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pendentes</span>
          {pendentesCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                statusFilter === 'pendentes' ? 'bg-white text-slate-700' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {pendentesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

