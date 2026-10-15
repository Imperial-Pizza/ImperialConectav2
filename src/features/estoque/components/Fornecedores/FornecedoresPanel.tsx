'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import { FornecedoresStats } from './FornecedoresStats';
import { FornecedoresToolbar } from './FornecedoresToolbar';
import { FornecedoresCards } from './FornecedoresCards';
import { FornecedoresTable } from './FornecedoresTable';
import { EstoquePagination } from '../Estoque/EstoquePagination';
import { exportarFornecedoresCsv } from '../../utils/planilha';
import type { UseFornecedoresReturn } from '../../hooks/useFornecedores';
import type { Fornecedor } from '../../types';

interface FornecedoresPanelProps {
  fornecedoresHook: UseFornecedoresReturn;
  onAddFornecedor: () => void;
  onEditFornecedor: (fornecedor: Fornecedor) => void;
  onDeleteFornecedor: (fornecedor: Fornecedor) => void;
}

const ITEMS_PER_PAGE = 9;

export function FornecedoresPanel({
  fornecedoresHook,
  onAddFornecedor,
  onEditFornecedor,
  onDeleteFornecedor,
}: FornecedoresPanelProps) {
  const {
    fornecedores,
    filteredFornecedores,
    metrics,
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    toggleStatus,
  } = fornecedoresHook;

  const [currentPage, setCurrentPage] = useState(1);

  // Reseta para a primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoria, statusFilter]);

  const totalPages = Math.ceil(filteredFornecedores.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredFornecedores.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await toggleStatus(id);
      if (updated) {
        toast.success(
          `Status de ${updated.nome} alterado para ${updated.status.toUpperCase()}!`
        );
      }
    } catch {
      toast.error('Não foi possível alterar o status do fornecedor.');
    }
  };

  const handleExportCsv = () => {
    if (filteredFornecedores.length === 0) {
      toast.error('Nenhum fornecedor disponível para exportação.');
      return;
    }
    exportarFornecedoresCsv(filteredFornecedores);
    toast.success('Planilha de fornecedores exportada com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cards de Métricas e Resumo */}
      <FornecedoresStats metrics={metrics} />

      {/* Toolbar Principal com Busca, Filtros e Ações */}
      <FornecedoresToolbar
        search={search}
        categoria={categoria}
        statusFilter={statusFilter}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onStatusFilterChange={setStatusFilter}
        onViewModeChange={setViewMode}
        onExportCsv={handleExportCsv}
        onAddFornecedor={onAddFornecedor}
      />

      {/* Área de Listagem com Loader, Erro ou Conteúdo */}
      {isLoading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-700">
          {error}
        </div>
      ) : filteredFornecedores.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200/80 flex items-center justify-center mx-auto">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Nenhum fornecedor encontrado
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos parceiros com os termos ou filtros selecionados. Tente ajustar a busca ou cadastre um novo fornecedor.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddFornecedor}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Fornecedor</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === 'cards' ? (
            <FornecedoresCards
              items={paginatedItems}
              onEdit={onEditFornecedor}
              onDelete={onDeleteFornecedor}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <FornecedoresTable
              items={paginatedItems}
              onEdit={onEditFornecedor}
              onDelete={onDeleteFornecedor}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* Paginação */}
          <EstoquePagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={filteredFornecedores.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </motion.div>
  );
}
