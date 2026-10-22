'use client';

import {
  Building2,
  ChevronDown,
  Download,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
} from 'lucide-react';

import { CATEGORIAS_FORNECEDOR, FILTRO_TODAS } from '../../utils/constants';
import { CustomSelect } from '@/components/ui/CustomSelect';
import type { EstoqueViewMode } from '../../types';
import type { FornecedorStatusFilter } from '../../hooks/useFornecedores';

interface FornecedoresToolbarProps {
  search: string;
  categoria: string;
  statusFilter: FornecedorStatusFilter;
  viewMode: EstoqueViewMode;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onStatusFilterChange: (status: FornecedorStatusFilter) => void;
  onViewModeChange: (mode: EstoqueViewMode) => void;
  onExportCsv: () => void;
  onAddFornecedor: () => void;
}

export function FornecedoresToolbar({
  search,
  categoria,
  statusFilter,
  viewMode,
  onSearchChange,
  onCategoriaChange,
  onStatusFilterChange,
  onViewModeChange,
  onExportCsv,
  onAddFornecedor,
}: FornecedoresToolbarProps) {
  const categoriaOptions = [
    { value: FILTRO_TODAS, label: 'Todas as Categorias' },
    ...CATEGORIAS_FORNECEDOR.map((cat) => ({ value: cat, label: cat })),
  ];

  const statusOptions = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'ativo', label: 'Apenas Ativos' },
    { value: 'inativo', label: 'Apenas Inativos' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Seção 1: Cabeçalho com Título e Ação Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Gestão de Fornecedores
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Cadastre parceiros, acompanhe prazos de entrega, contatos diretos e condições comerciais
          </p>
        </div>

        {/* Botão Novo Fornecedor */}
        <button
          type="button"
          onClick={onAddFornecedor}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      {/* Linha Divisória */}
      <div className="border-t border-slate-100" />

      {/* Seção 2: Filtros, Busca, Exportar e Modo de Visualização */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Lado Esquerdo: Busca e Filtros */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Campo de Busca */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, CNPJ, contato..."
              aria-label="Buscar fornecedores"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all shadow-2xs"
            />
          </div>

          {/* Filtro por Categoria */}
          <CustomSelect
            value={categoria}
            onChange={onCategoriaChange}
            options={categoriaOptions}
            ariaLabel="Filtrar fornecedores por categoria"
            activeColorClass="bg-blue-50/90 border-blue-300 text-blue-900"
          />

          {/* Filtro por Status */}
          <CustomSelect
            value={statusFilter}
            onChange={(val) => onStatusFilterChange(val as FornecedorStatusFilter)}
            options={statusOptions}
            ariaLabel="Filtrar fornecedores por status"
            activeColorClass="bg-emerald-50/90 border-emerald-300 text-emerald-900"
          />
        </div>

        {/* Lado Direito: Exportar e Modo de Visualização */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-start sm:justify-end">
          {/* Botão Exportar CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            title="Exportar lista de fornecedores para CSV"
            className="px-3.5 py-2.5 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>

          {/* Alternador Lista / Cards */}
          <div
            className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0 shadow-2xs"
            role="group"
            aria-label="Modo de visualização"
          >
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
          </div>
        </div>
      </div>
    </div>
  );
}
