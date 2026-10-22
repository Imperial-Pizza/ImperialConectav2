'use client';

import {
  Download,
  LayoutGrid,
  LayoutList,
  Plus,
  Scale,
  Search,
  X,
} from 'lucide-react';
import { CATEGORIAS_PRODUTO_PESADO, FILTRO_TODAS } from '../../utils/constants';
import { CustomSelect } from '@/components/ui/CustomSelect';
import type { EstoqueViewMode } from '../../types';

interface ProdutosPesadosToolbarProps {
  search: string;
  categoria: string;
  viewMode: EstoqueViewMode;
  apenasBaixo: boolean;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onViewModeChange: (mode: EstoqueViewMode) => void;
  onToggleApenasBaixo: () => void;
  onExportCsv: () => void;
  onAddProdutoPesado: () => void;
}

export function ProdutosPesadosToolbar({
  search,
  categoria,
  viewMode,
  apenasBaixo,
  onSearchChange,
  onCategoriaChange,
  onViewModeChange,
  onToggleApenasBaixo,
  onExportCsv,
  onAddProdutoPesado,
}: ProdutosPesadosToolbarProps) {
  const categoriaOptions = [
    { value: FILTRO_TODAS, label: 'Todas as Categorias' },
    ...CATEGORIAS_PRODUTO_PESADO.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Produtos Pesados & Fracionamento
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Balança & Pré-Preparo
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Controle pacotes de muçarela triturada, frios fatiados, molhos e porções prontas para produção
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProdutoPesado}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pesagem / Fracionamento</span>
        </button>
      </div>

      {/* Controles de Busca e Filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, código, lote ou insumo de origem..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Categoria */}
          <CustomSelect
            value={categoria}
            onChange={onCategoriaChange}
            options={categoriaOptions}
            ariaLabel="Filtrar por categoria"
            activeColorClass="bg-emerald-50/90 border-emerald-300 text-emerald-900"
          />
        </div>

        {/* Ações da Direita */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Botão Exportar CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            title="Exportar dados de pesagem em CSV"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          {/* Toggle de Visualização (Tabela vs Cards) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Visualização em Lista/Tabela"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              title="Visualização em Cards"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
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
