'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';

import { EstoqueStats } from './EstoqueStats';
import { EstoqueToolbar } from './EstoqueToolbar';
import { EstoqueTable } from './EstoqueTable';
import { EstoqueCards } from './EstoqueCards';
import { EstoquePagination } from './EstoquePagination';
import { QuickStockModal } from '../Modals/QuickStockModal';
import { SupplierContactModal } from '../Modals/SupplierContactModal';
import { EtiquetaInsumoModal } from '../Modals/EtiquetaInsumoModal';
import { exportarCsv, exportarExcel, lerArquivoTexto, parsePlanilha } from '../../utils/planilha';
import type { UseEstoqueReturn } from '../../hooks/useEstoque';
import type { Fornecedor, Insumo } from '../../types';

interface EstoquePanelProps {
  estoque: UseEstoqueReturn;
  fornecedores?: Fornecedor[];
  onAddInsumo: () => void;
  onEditInsumo: (insumo: Insumo) => void;
  onDeleteInsumo: (insumo: Insumo) => void;
  onNavigateToFornecedores?: () => void;
  onNavigateToBalanco?: () => void;
}

const ITEMS_PER_PAGE = 10;

export function EstoquePanel({
  estoque,
  fornecedores = [],
  onAddInsumo,
  onEditInsumo,
  onDeleteInsumo,
  onNavigateToFornecedores,
  onNavigateToBalanco,
}: EstoquePanelProps) {
  const {
    items,
    filteredItems,
    metrics,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    viewMode,
    setViewMode,
    importInsumos,
    ajustarEstoque,
  } = estoque;

  const [currentPage, setCurrentPage] = useState(1);
  const [adjustingInsumo, setAdjustingInsumo] = useState<Insumo | null>(null);
  const [viewingSupplierInsumo, setViewingSupplierInsumo] = useState<Insumo | null>(null);
  const [printingInsumo, setPrintingInsumo] = useState<Insumo | null>(null);

  // Reseta para a primeira página sempre que a busca ou filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoria, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

  // Garante que currentPage não fique além do limite se os itens diminuírem
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleImport = async (file: File) => {
    const toastId = toast.loading('Salvando insumos no banco de dados...');
    try {
      const texto = await lerArquivoTexto(file);
      const novos = parsePlanilha(texto);

      if (novos.length === 0) {
        toast.error('Nenhum insumo válido encontrado na planilha.', { id: toastId });
        return;
      }

      const res: any = await importInsumos(novos);
      const importados = res?.importados ?? 0;
      const atualizados = res?.atualizados ?? 0;
      const total = res?.total ?? novos.length;

      toast.success(
        `${total} insumos processados no banco de dados! (${importados} novos cadastrados, ${atualizados} atualizados)`,
        { id: toastId, duration: 5000 }
      );
    } catch (err: any) {
      toast.error(err?.message || 'Não foi possível salvar os insumos importados no banco de dados.', { id: toastId });
    }
  };

  const handleConfirmQuickAdjust = async (delta: number) => {
    if (!adjustingInsumo) return;
    try {
      const novoSaldo = await ajustarEstoque(adjustingInsumo.id, delta);
      toast.success(
        `Estoque de ${adjustingInsumo.nome} atualizado para ${novoSaldo} ${adjustingInsumo.unidade}!`
      );
      setAdjustingInsumo(null);
    } catch {
      toast.error('Não foi possível movimentar o estoque.');
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
      {/* Cards de KPIs e Estatísticas do Estoque (Puramente Informativos) */}
      <EstoqueStats metrics={metrics} />

      <EstoqueToolbar
        search={search}
        categoria={categoria}
        statusFilter={statusFilter}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onStatusFilterChange={setStatusFilter}
        onViewModeChange={setViewMode}
        onImport={handleImport}
        onExportCsv={() => exportarCsv(items)}
        onExportExcel={() => exportarExcel(items)}
        onAddInsumo={onAddInsumo}
        onNavigateToBalanco={onNavigateToBalanco}
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
          <p className="text-xs text-slate-500">
            {statusFilter !== 'todos'
              ? 'Nenhum insumo corresponde ao nível de estoque selecionado.'
              : 'Ajuste a busca ou o filtro de categoria.'}
          </p>
          {statusFilter !== 'todos' && (
            <button
              type="button"
              onClick={() => setStatusFilter('todos')}
              className="mt-2 text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Mostrar todos os insumos
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <EstoqueTable
              items={paginatedItems}
              onEdit={onEditInsumo}
              onDelete={onDeleteInsumo}
              onQuickAdjust={(insumo) => setAdjustingInsumo(insumo)}
              onViewSupplier={(insumo) => setViewingSupplierInsumo(insumo)}
              onPrintEtiqueta={(insumo) => setPrintingInsumo(insumo)}
            />
          ) : (
            <EstoqueCards
              items={paginatedItems}
              onEdit={onEditInsumo}
              onDelete={onDeleteInsumo}
              onQuickAdjust={(insumo) => setAdjustingInsumo(insumo)}
              onViewSupplier={(insumo) => setViewingSupplierInsumo(insumo)}
              onPrintEtiqueta={(insumo) => setPrintingInsumo(insumo)}
            />
          )}

          {/* Paginação com no máximo 10 itens por página */}
          <EstoquePagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal de Movimentação Rápida (+ / -) */}
      <QuickStockModal
        open={Boolean(adjustingInsumo)}
        insumo={adjustingInsumo}
        onClose={() => setAdjustingInsumo(null)}
        onConfirm={handleConfirmQuickAdjust}
      />

      {/* Modal de Contato com Fornecedor do Insumo */}
      <SupplierContactModal
        open={Boolean(viewingSupplierInsumo)}
        insumo={viewingSupplierInsumo}
        fornecedores={fornecedores}
        onClose={() => setViewingSupplierInsumo(null)}
        onNavigateToFornecedores={onNavigateToFornecedores}
      />

      {/* Modal de Impressão de Etiqueta Térmica do Insumo */}
      <EtiquetaInsumoModal
        open={Boolean(printingInsumo)}
        insumo={printingInsumo}
        onClose={() => setPrintingInsumo(null)}
      />
    </motion.div>
  );
}
