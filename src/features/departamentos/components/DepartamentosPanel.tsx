'use client';

import { motion } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { DepartamentosToolbar } from './DepartamentosToolbar';
import { DepartamentosTable } from './DepartamentosTable';
import { DepartamentosCards } from './DepartamentosCards';
import { DepartamentosPagination } from './DepartamentosPagination';
import { DepartamentoDetalheModal } from './DepartamentoDetalheModal';
import { exportarDepartamentosCsv } from '../services/departamentosService';
import type { UseDepartamentosReturn } from '../hooks/useDepartamentos';

interface DepartamentosPanelProps {
  departamentos: UseDepartamentosReturn;
}

export function DepartamentosPanel({ departamentos }: DepartamentosPanelProps) {
  const {
    items,
    total,
    page,
    perPage,
    totalPages,
    setPage,
    search,
    setSearch,
    viewMode,
    setViewMode,
    isLoading,
    error,
    reload,
    selectedDetail,
    isLoadingDetail,
    openDetail,
    closeDetail,
  } = departamentos;

  const handleExportCsv = () => {
    if (items.length === 0) {
      toast.error('Nenhum departamento disponível para exportar.');
      return;
    }
    exportarDepartamentosCsv(items);
    toast.success('Planilha de departamentos exportada com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Toolbar (Sem KPIs no topo, conforme solicitado) */}
      <DepartamentosToolbar
        search={search}
        viewMode={viewMode}
        isLoading={isLoading}
        onSearchChange={setSearch}
        onViewModeChange={setViewMode}
        onExportCsv={handleExportCsv}
        onRefresh={reload}
      />

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-2">
          <Building2 className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Nenhum departamento encontrado</p>
          <p className="text-xs text-slate-500">
            {search.trim()
              ? 'Nenhum setor corresponde aos termos pesquisados.'
              : 'Ainda não há departamentos cadastrados no sistema.'}
          </p>
          {search.trim() && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-2 text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <DepartamentosTable items={items} onViewDetail={openDetail} />
          ) : (
            <DepartamentosCards items={items} onViewDetail={openDetail} />
          )}

          <DepartamentosPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={perPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modal de Detalhes e Equipe do Departamento */}
      <DepartamentoDetalheModal
        open={Boolean(selectedDetail)}
        departamento={selectedDetail}
        isLoading={isLoadingDetail}
        onClose={closeDetail}
      />
    </motion.div>
  );
}

