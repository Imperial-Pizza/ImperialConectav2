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
} from 'lucide-react';

import { CATEGORIAS_INSUMO, FILTRO_TODAS } from '../../utils/constants';
import type { EstoqueViewMode } from '../../types';

interface EstoqueToolbarProps {
  search: string;
  categoria: string;
  viewMode: EstoqueViewMode;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
  onViewModeChange: (mode: EstoqueViewMode) => void;
  onImport: (file: File) => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onAddInsumo: () => void;
}

export function EstoqueToolbar({
  search,
  categoria,
  viewMode,
  onSearchChange,
  onCategoriaChange,
  onViewModeChange,
  onImport,
  onExportCsv,
  onExportExcel,
  onAddInsumo,
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

        {/* Botão Novo Insumo - Destaque no topo à direita */}
        <button
          type="button"
          onClick={onAddInsumo}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-black transition-all shadow-md shadow-red-600/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Insumo</span>
        </button>
      </div>

      {/* Linha Divisória Sutil */}
      <div className="border-t border-slate-100" />

      {/* Seção 2: Filtros, Busca, Importar/Exportar e Visualização */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Lado Esquerdo: Busca e Categoria */}
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
              placeholder="Buscar insumos..."
              aria-label="Buscar insumos"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all shadow-2xs"
            />
          </div>

          {/* Filtro por Categoria */}
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => onCategoriaChange(e.target.value)}
              aria-label="Filtrar por categoria"
              className="appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all cursor-pointer shadow-2xs"
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
        </div>

        {/* Lado Direito: Importar, Exportar e Modo de Visualização */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-start sm:justify-end">
          {/* Botão Importar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Importar planilha de insumos (.csv, .xlsx, .txt)"
            className="px-3.5 py-2.5 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Importar</span>
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
              <span>Exportar</span>
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
    </div>
  );
}
