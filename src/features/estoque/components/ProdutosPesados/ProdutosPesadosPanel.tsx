'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Scale } from 'lucide-react';
import toast from 'react-hot-toast';

import { ProdutosPesadosStats } from './ProdutosPesadosStats';
import { ProdutosPesadosToolbar } from './ProdutosPesadosToolbar';
import { ProdutosPesadosTable } from './ProdutosPesadosTable';
import { ProdutosPesadosCards } from './ProdutosPesadosCards';
import { EstoquePagination } from '../Estoque/EstoquePagination';
import { AddProdutoPesadoModal } from '../Modals/AddProdutoPesadoModal';
import { DeleteProdutoPesadoModal } from '../Modals/DeleteProdutoPesadoModal';
import { EtiquetaBalancaModal } from '../Modals/EtiquetaBalancaModal';
import { QuickAdjustPesadoModal } from '../Modals/QuickAdjustPesadoModal';
import type { UseProdutosPesadosReturn } from '../../hooks/useProdutosPesados';
import type { NovoProdutoPesado, ProdutoPesado } from '../../types';

interface ProdutosPesadosPanelProps {
  produtosPesados: UseProdutosPesadosReturn;
  insumosDisponiveis?: string[];
}

const ITEMS_PER_PAGE = 8;

export function ProdutosPesadosPanel({
  produtosPesados,
  insumosDisponiveis,
}: ProdutosPesadosPanelProps) {
  const {
    items,
    filteredItems,
    metrics,
    apenasBaixo,
    setApenasBaixo,
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    viewMode,
    setViewMode,
    addProdutoPesado,
    editProdutoPesado,
    deleteProdutoPesado,
    ajustarPacotes,
  } = produtosPesados;

  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProdutoPesado | null>(null);
  const [deletingItem, setDeletingItem] = useState<ProdutoPesado | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<ProdutoPesado | null>(null);
  const [printingItem, setPrintingItem] = useState<ProdutoPesado | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoria, apenasBaixo]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleExportCsv = () => {
    if (filteredItems.length === 0) {
      toast.error('Nenhum produto pesado disponível para exportação.');
      return;
    }

    const cabecalho =
      'Código,Produto Pesado,Categoria,Insumo Origem,Peso Unit (kg),Pacotes,Peso Total (kg),Custo/kg,Valor Total,Lote,Validade,Responsável';
    const linhas = filteredItems.map((item) =>
      [
        `"${item.codigo}"`,
        `"${item.nome}"`,
        `"${item.categoria}"`,
        `"${item.insumoOrigem}"`,
        item.pesoUnitarioKg,
        item.quantidadePacotes,
        item.pesoTotalKg,
        item.custoPorKg.toFixed(2),
        (item.pesoTotalKg * item.custoPorKg).toFixed(2),
        `"${item.lote}"`,
        `"${item.dataValidade}"`,
        `"${item.responsavel}"`,
      ].join(',')
    );

    const conteudoCsv = [cabecalho, ...linhas].join('\n');
    const blob = new Blob(['\uFEFF' + conteudoCsv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `imperial_produtos_pesados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Relatório de pesagem exportado com sucesso!');
  };

  const handleConfirmAdd = async (dados: NovoProdutoPesado) => {
    try {
      await addProdutoPesado(dados);
      toast.success(`Lote de ${dados.nome} cadastrado com sucesso!`);
      setShowAddModal(false);
    } catch {
      toast.error('Não foi possível cadastrar o produto pesado.');
    }
  };

  const handleConfirmEdit = async (dados: NovoProdutoPesado) => {
    if (!editingItem) return;
    try {
      await editProdutoPesado(editingItem.id, dados);
      toast.success(`Produto ${dados.nome} atualizado!`);
      setEditingItem(null);
    } catch {
      toast.error('Não foi possível atualizar o lote.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteProdutoPesado(deletingItem.id);
      toast.success(`Lote ${deletingItem.nome} removido!`);
      setDeletingItem(null);
    } catch {
      toast.error('Não foi possível remover o lote.');
    }
  };

  const handleConfirmQuickAdjust = async (deltaPacotes: number) => {
    if (!adjustingItem) return;
    try {
      const res = await ajustarPacotes(adjustingItem.id, deltaPacotes);
      if (res) {
        toast.success(
          `Estoque de ${adjustingItem.nome} ajustado para ${res.novaQtd} pacotes (${res.novoPesoTotal} kg)!`
        );
      }
      setAdjustingItem(null);
    } catch {
      toast.error('Não foi possível ajustar a quantidade de pacotes.');
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
      {/* 1. Métricas da Balança e Fracionamento (Informativo) */}
      <ProdutosPesadosStats metrics={metrics} />

      {/* 2. Barra de Ferramentas / Filtros */}
      <ProdutosPesadosToolbar
        search={search}
        categoria={categoria}
        viewMode={viewMode}
        apenasBaixo={apenasBaixo}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onViewModeChange={setViewMode}
        onToggleApenasBaixo={() => setApenasBaixo(!apenasBaixo)}
        onExportCsv={handleExportCsv}
        onAddProdutoPesado={() => {
          setEditingItem(null);
          setShowAddModal(true);
        }}
      />

      {/* 3. Conteúdo Principal */}
      {isLoading ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Carregando produtos pesados e balança...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-2">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Scale className="w-8 h-8 text-slate-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">
              Nenhum produto pesado encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos nenhum lote para o filtro atual. Tente alterar os termos da busca ou registre uma nova pesagem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategoria('Todas');
              setApenasBaixo(false);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ProdutosPesadosTable
              items={paginatedItems}
              onEdit={(item) => setEditingItem(item)}
              onDelete={(item) => setDeletingItem(item)}
              onQuickAdjust={(item) => setAdjustingItem(item)}
              onPrintEtiqueta={(item) => setPrintingItem(item)}
            />
          ) : (
            <ProdutosPesadosCards
              items={paginatedItems}
              onEdit={(item) => setEditingItem(item)}
              onDelete={(item) => setDeletingItem(item)}
              onQuickAdjust={(item) => setAdjustingItem(item)}
              onPrintEtiqueta={(item) => setPrintingItem(item)}
            />
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <EstoquePagination
              currentPage={validPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Modal de Cadastro de Produto Pesado */}
      <AddProdutoPesadoModal
        open={showAddModal}
        insumosDisponiveis={insumosDisponiveis}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleConfirmAdd}
      />

      {/* Modal de Edição de Produto Pesado */}
      <AddProdutoPesadoModal
        open={Boolean(editingItem)}
        initialData={editingItem}
        insumosDisponiveis={insumosDisponiveis}
        onClose={() => setEditingItem(null)}
        onSubmit={handleConfirmEdit}
      />

      {/* Modal de Exclusão */}
      <DeleteProdutoPesadoModal
        open={Boolean(deletingItem)}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal de Ajuste Rápido de Pacotes */}
      <QuickAdjustPesadoModal
        open={Boolean(adjustingItem)}
        item={adjustingItem}
        onClose={() => setAdjustingItem(null)}
        onConfirm={handleConfirmQuickAdjust}
      />

      {/* Modal de Etiqueta Térmica de Balança */}
      <EtiquetaBalancaModal
        open={Boolean(printingItem)}
        item={printingItem}
        onClose={() => setPrintingItem(null)}
      />
    </motion.div>
  );
}
