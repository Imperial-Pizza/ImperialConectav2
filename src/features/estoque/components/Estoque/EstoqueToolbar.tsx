'use client';

import { useRef } from 'react';
import { Download, FileSpreadsheet, Plus, Search, Upload } from 'lucide-react';

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

const toolButton =
  'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer';

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

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Estoque de Insumos
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Gerencie massas, queijos, molhos e custos unitários
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = '';
          }}
        />

        {/* Importar / Exportar */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={toolButton}
            title="Importar CSV ou planilha exportada pelo sistema"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Importar</span>
          </button>

          <button type="button" onClick={onExportCsv} className={toolButton} title="Exportar como CSV">
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button type="button" onClick={onExportExcel} className={toolButton} title="Exportar para Excel">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>Excel</span>
          </button>
        </div>

        {/* Filtro por categoria */}
        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          aria-label="Filtrar por categoria"
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-600 shadow-sm transition-all cursor-pointer"
        >
          <option value={FILTRO_TODAS}>Todas as Categorias</option>
          {CATEGORIAS_INSUMO.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Busca */}
        <div className="relative w-full sm:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar..."
            aria-label="Buscar insumos"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 shadow-sm transition-all"
          />
        </div>

        {/* Lista / Cards */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0" role="group" aria-label="Modo de visualização">
          {(['table', 'cards'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              aria-pressed={viewMode === mode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode === 'table' ? 'Lista' : 'Cards'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddInsumo}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Insumo</span>
        </button>
      </div>
    </div>
  );
}
