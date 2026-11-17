'use client';

import {
  Download,
  LayoutGrid,
  LayoutList,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import type { DepartamentosViewMode } from '../types';

interface DepartamentosToolbarProps {
  search: string;
  viewMode: DepartamentosViewMode;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: DepartamentosViewMode) => void;
  onExportCsv: () => void;
  onRefresh: () => void;
}

export function DepartamentosToolbar({
  search,
  viewMode,
  isLoading = false,
  onSearchChange,
  onViewModeChange,
  onExportCsv,
  onRefresh,
}: DepartamentosToolbarProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-6">
      {/* Seção 1: Cabeçalho com Título e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Departamentos Cadastrados
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">
            Visualize todos os setores, centros de custo, gestores responsáveis e equipes da Imperial Pizza
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xs disabled:opacity-60"
            title="Atualizar lista de departamentos"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Linha Divisória Sutil */}
      <div className="border-t border-slate-100" />

      {/* Seção 2: Linha Principal (Busca, Exportar e Modo de Visualização) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Campo de Busca Expansível */}
        <div className="relative flex-1 max-w-lg min-w-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, código, gestor ou centro de custo..."
            aria-label="Buscar departamentos"
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Lado Direito: Exportar e Alternador Lista / Cards */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            title="Exportar departamentos em CSV"
            className="px-3.5 py-2.5 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <div
            className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0 shadow-2xs"
            role="group"
            aria-label="Modo de visualização"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Visualização em Lista"
              aria-label="Visualização em Lista"
              aria-pressed={viewMode === 'table'}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              title="Visualização em Cards"
              aria-label="Visualização em Cards"
              aria-pressed={viewMode === 'cards'}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

