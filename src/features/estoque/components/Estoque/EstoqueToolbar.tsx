'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  Upload,
  ChevronDown,
  SlidersHorizontal,
  X,
  ClipboardCheck,
} from 'lucide-react';

import { CATEGORIAS_INSUMO, FILTRO_TODAS } from '../../utils/constants';
import type { EstoqueViewMode, InsumoStatusFilter } from '../../types';

interface EstoqueToolbarProps {
  search: string;
  categoria: string;
  statusFilter: InsumoStatusFilter;
  viewMode: EstoqueViewMode;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onStatusFilterChange: (status: InsumoStatusFilter) => void;
  onViewModeChange: (mode: EstoqueViewMode) => void;
  onImport: (file: File) => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onAddInsumo: () => void;
  onNavigateToBalanco?: () => void;
}

export function EstoqueToolbar({
  search,
  categoria,
  statusFilter,
  viewMode,
  onSearchChange,
  onCategoriaChange,
  onStatusFilterChange,
  onViewModeChange,
  onImport,
  onExportCsv,
  onExportExcel,
  onAddInsumo,
  onNavigateToBalanco,
}: EstoqueToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown de exportação ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Input Oculto de Arquivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = '';
        }}
      />

      {/* Seção 1: Cabeçalho com Título e Ação Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Estoque de Insumos
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gerencie massas, queijos, molhos e custos unitários em tempo real
          </p>
        </div>

        {/* Botões de Ação no topo */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateToBalanco && (
            <button
              type="button"
              onClick={onNavigateToBalanco}
              className="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 active:scale-[0.98] text-purple-750 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-purple-800"
              title="Auditar contagem física e realizar balanço de estoque"
            >
              <ClipboardCheck className="w-4 h-4 text-purple-600" />
              <span>Balanço de Estoque</span>
            </button>
          )}

          {/* Botão Novo Insumo - Destaque no topo à direita */}
          <button
            type="button"
            onClick={onAddInsumo}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Insumo</span>
          </button>
        </div>
      </div>

      {/* Linha Divisória Sutil */}
      <div className="border-t border-slate-100" />

      {/* Seção 2: Linha Principal (Busca e Ações Rápidas) */}
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
            placeholder="Buscar insumos por nome, código ou categoria..."
            aria-label="Buscar insumos"
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

        {/* Lado Direito: Importar, Exportar e Modo de Visualização */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Botão Importar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Importar planilha de insumos (.csv, .xlsx, .txt)"
            className="px-3.5 py-2.5 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Importar</span>
          </button>

          {/* Dropdown / Botão Exportar */}
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              title="Exportar planilha de insumos"
              className="px-3.5 py-2.5 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Exportar</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    onExportExcel();
                    setExportOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Planilha Excel (.xls)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setExportOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Arquivo CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          {/* Alternador Lista / Cards (Ícones Padrão) */}
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

      {/* Seção 3: Barra Dedicada de Filtros (Categorias, Nível de Estoque e Reset) */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Rótulo de Filtros */}
          <div className="flex items-center gap-1.5 text-slate-400 mr-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Filtros:
            </span>
          </div>

          {/* Filtro por Categoria */}
          <div className="relative shrink-0">
            <select
              value={categoria}
              onChange={(e) => onCategoriaChange(e.target.value)}
              aria-label="Filtrar por categoria"
              className={`appearance-none pl-3.5 pr-8 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 ${
                categoria !== FILTRO_TODAS
                  ? 'bg-red-50/80 border-red-300 text-red-900'
                  : 'bg-slate-50/90 hover:bg-slate-100/70 border-slate-200/90 text-slate-700'
              }`}
            >
              <option value={FILTRO_TODAS}>Todas as Categorias</option>
              {CATEGORIAS_INSUMO.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filtro por Nível de Estoque (Status) */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as InsumoStatusFilter)}
              aria-label="Filtrar por nível de estoque"
              className={`appearance-none pl-3.5 pr-8 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 ${
                statusFilter !== 'todos'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                  : 'bg-slate-50/90 hover:bg-slate-100/70 border-slate-200/90 text-slate-700'
              }`}
            >
              <option value="todos">Todos os Níveis de Estoque</option>
              <option value="critico">🚨 Críticos / Estoque Baixo</option>
              <option value="mediano">⚠️ Medianos / Em Alerta</option>
              <option value="ok">✅ Em Dia / Nível OK</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Botão Limpar Filtros Ativos */}
          {(categoria !== FILTRO_TODAS || statusFilter !== 'todos' || search.trim().length > 0) && (
            <button
              type="button"
              onClick={() => {
                onCategoriaChange(FILTRO_TODAS);
                onStatusFilterChange('todos');
                onSearchChange('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200/60 transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Limpar busca e filtros ativos"
            >
              <X className="w-3 h-3" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
