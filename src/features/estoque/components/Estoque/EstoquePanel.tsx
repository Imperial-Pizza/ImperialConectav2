'use client';

import { motion } from 'framer-motion';
import { Loader2, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';

import { EstoqueToolbar } from './EstoqueToolbar';
import { EstoqueTable } from './EstoqueTable';
import { EstoqueCards } from './EstoqueCards';
import { exportarCsv, exportarExcel, lerArquivoTexto, parsePlanilha } from '../../utils/planilha';
import type { UseEstoqueReturn } from '../../hooks/useEstoque';
import type { Insumo } from '../../types';

interface EstoquePanelProps {
  estoque: UseEstoqueReturn;
  onAddInsumo: () => void;
  onEditInsumo: (insumo: Insumo) => void;
  onDeleteInsumo: (insumo: Insumo) => void;
}

export function EstoquePanel({
  estoque,
  onAddInsumo,
  onEditInsumo,
  onDeleteInsumo,
}: EstoquePanelProps) {
  const {
    items,
    filteredItems,
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    viewMode,
    setViewMode,
    importInsumos,
  } = estoque;

  const handleImport = async (file: File) => {
    try {
      const texto = await lerArquivoTexto(file);
      const novos = parsePlanilha(texto);

      if (novos.length === 0) {
        toast.error('Nenhum insumo válido encontrado na planilha.');
        return;
      }

      importInsumos(novos);
      toast.success(`${novos.length} insumos importados com sucesso!`);
    } catch {
      toast.error('Não foi possível ler o arquivo selecionado.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <EstoqueToolbar
        search={search}
        categoria={categoria}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onViewModeChange={setViewMode}
        onImport={handleImport}
        onExportCsv={() => exportarCsv(items)}
        onExportExcel={() => exportarExcel(items)}
        onAddInsumo={onAddInsumo}
      />

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-700">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-2">
          <PackageSearch className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Nenhum insumo encontrado</p>
          <p className="text-xs text-slate-500">Ajuste a busca ou o filtro de categoria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <EstoqueTable
          items={filteredItems}
          onEdit={onEditInsumo}
          onDelete={onDeleteInsumo}
        />
      ) : (
        <EstoqueCards
          items={filteredItems}
          onEdit={onEditInsumo}
          onDelete={onDeleteInsumo}
        />
      )}
    </motion.div>
  );
}
