'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle2, PackageSearch, Sparkles } from 'lucide-react';

import { BalancoStats } from './BalancoStats';
import { BalancoToolbar } from './BalancoToolbar';
import { BalancoTable } from './BalancoTable';
import { BalancoCards } from './BalancoCards';
import { EstoquePagination } from '../Estoque/EstoquePagination';
import { FinalizarBalancoModal } from './FinalizarBalancoModal';
import { HistoricoBalancoModal } from './HistoricoBalancoModal';
import { useBalanco } from '../../hooks/useBalanco';
import type { EstoqueViewMode } from '../../types';
import type { UseEstoqueReturn } from '../../hooks/useEstoque';

interface BalancoPanelProps {
  estoque: UseEstoqueReturn;
}

const ITEMS_PER_PAGE = 8;

export function BalancoPanel({ estoque }: BalancoPanelProps) {
  const [viewMode, setViewMode] = useState<EstoqueViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  const balanco = useBalanco(estoque.items, estoque.aplicarBalanco);

  const {
    itensBalanco,
    filteredItens,
    metrics,
    search,
    setSearch,
    categoria,
    setCategoria,
    statusFilter,
    setStatusFilter,
    historico,
    setContagem,
    ajustarContagem,
    marcarBateu,
    setMotivo,
    preencherTodosComSaldoAtual,
    limparContagem,
    finalizarBalanco,
  } = balanco;

  // Reseta a página sempre que busca, categoria ou status mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoria, statusFilter]);

  const totalPages = Math.ceil(filteredItens.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItens.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreencherTudo = () => {
    preencherTodosComSaldoAtual();
    toast.success('Todos os saldos do sistema foram copiados para a contagem física!');
  };

  const handleLimpar = () => {
    limparContagem();
    toast('Contagem física resetada.', { icon: '🧹' });
  };

  const handleConfirmarFinalizacao = async (responsavel: string) => {
    try {
      const res = await finalizarBalanco(responsavel);
      toast.success(
        `Balanço ${res.id} concluído com sucesso! ${res.totalItensContados} itens sincronizados.`,
        { duration: 4000 }
      );
    } catch {
      toast.error('Não foi possível finalizar o balanço.');
      throw new Error('finalizar-balanco-failed');
    }
  };

  const temContagens = Object.keys(balanco.contagens).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cards de Métricas em Tempo Real no Padrão Imperial */}
      <BalancoStats metrics={metrics} />

      {/* Barra de Ferramentas, Busca e Filtros */}
      <BalancoToolbar
        search={search}
        categoria={categoria}
        statusFilter={statusFilter}
        viewMode={viewMode}
        contadosCount={metrics.contadosCount}
        divergentesCount={metrics.divergentesCount}
        bateuCount={metrics.bateuCount}
        pendentesCount={metrics.pendentesCount}
        temContagens={temContagens}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onStatusFilterChange={setStatusFilter}
        onViewModeChange={setViewMode}
        onPreencherComSaldoAtual={handlePreencherTudo}
        onLimparContagem={handleLimpar}
        onOpenFinalizarModal={() => setShowFinalizarModal(true)}
        onOpenHistoricoModal={() => setShowHistoricoModal(true)}
      />

      {/* Banner de Feedback Dinâmico da Auditoria */}
      {metrics.contadosCount > 0 && (
        <div
          className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            metrics.divergentesCount > 0
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {metrics.divergentesCount > 0 ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium">
              {metrics.divergentesCount > 0 ? (
                <>
                  Foram encontradas <strong className="font-bold">{metrics.divergentesCount} divergências</strong> entre o estoque físico e o sistema. Selecione os motivos para manter seu histórico de quebras organizado.
                </>
              ) : (
                <>
                  Excelente! Todos os <strong className="font-bold">{metrics.contadosCount} itens conferidos</strong> bateram 100% com o estoque do sistema.
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowFinalizarModal(true)}
            className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer transition-all active:scale-95"
          >
            Revisar & Finalizar
          </button>
        </div>
      )}

      {/* Lista / Grade de Insumos da Auditoria */}
      {filteredItens.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-2">
          <PackageSearch className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Nenhum insumo encontrado</p>
          <p className="text-xs text-slate-500">
            {statusFilter !== 'todos'
              ? 'Nenhum insumo corresponde ao filtro de divergência selecionado.'
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
            <BalancoTable
              items={paginatedItems}
              onSetContagem={setContagem}
              onAjustarContagem={ajustarContagem}
              onMarcarBateu={marcarBateu}
              onSetMotivo={setMotivo}
            />
          ) : (
            <BalancoCards
              items={paginatedItems}
              onSetContagem={setContagem}
              onAjustarContagem={ajustarContagem}
              onMarcarBateu={marcarBateu}
              onSetMotivo={setMotivo}
            />
          )}

          {/* Paginação Padrão Imperial */}
          <EstoquePagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={filteredItens.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal de Finalização & Sincronização */}
      <FinalizarBalancoModal
        open={showFinalizarModal}
        itens={itensBalanco}
        metrics={metrics}
        onClose={() => setShowFinalizarModal(false)}
        onConfirm={handleConfirmarFinalizacao}
      />

      {/* Modal de Histórico de Balanços */}
      <HistoricoBalancoModal
        open={showHistoricoModal}
        historico={historico}
        onClose={() => setShowHistoricoModal(false)}
      />
    </motion.div>
  );
}
