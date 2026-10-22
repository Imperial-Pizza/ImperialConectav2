'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { AppShell } from '@/layouts/AppShell';

import { EstoqueSidebar } from './Sidebar/EstoqueSidebar';
import { EstoquePanel } from './Estoque/EstoquePanel';
import { ProdutosPesadosPanel } from './ProdutosPesados/ProdutosPesadosPanel';
import { FornecedoresPanel } from './Fornecedores/FornecedoresPanel';
import { CmvPanel } from './Cmv/CmvPanel';
import { BalancoPanel } from './Balanco/BalancoPanel';
import { AddInsumoModal } from './Modals/AddInsumoModal';
import { DeleteInsumoModal } from './Modals/DeleteInsumoModal';
import { AddFornecedorModal } from './Modals/AddFornecedorModal';
import { DeleteFornecedorModal } from './Modals/DeleteFornecedorModal';
import { useEstoque } from '../hooks/useEstoque';
import { useProdutosPesados } from '../hooks/useProdutosPesados';
import { useFornecedores } from '../hooks/useFornecedores';
import { useCmv } from '../hooks/useCmv';
import type { EstoqueSubModule, Fornecedor, Insumo, NovoFornecedor, NovoInsumo } from '../types';

export default function EstoqueView() {
  const [activeSubModule, setActiveSubModule] = useState<EstoqueSubModule>('estoque');

  // Estados de Modais de Insumos
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [deletingInsumo, setDeletingInsumo] = useState<Insumo | null>(null);

  // Estados de Modais de Fornecedores
  const [showAddFornecedorModal, setShowAddFornecedorModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [deletingFornecedor, setDeletingFornecedor] = useState<Fornecedor | null>(null);

  const estoque = useEstoque();
  const produtosPesadosHook = useProdutosPesados();
  const fornecedoresHook = useFornecedores();
  const cmv = useCmv(estoque.items);

  // Handlers de Insumos
  const handleAddInsumo = async (novo: NovoInsumo) => {
    try {
      await estoque.addInsumo(novo);
      toast.success('Insumo cadastrado com sucesso!');
    } catch {
      toast.error('Não foi possível cadastrar o insumo.');
      throw new Error('add-insumo-failed');
    }
  };

  const handleEditInsumo = async (dados: NovoInsumo) => {
    if (!editingInsumo) return;
    try {
      await estoque.editInsumo(editingInsumo.id, dados);
      toast.success('Insumo atualizado com sucesso!');
      setEditingInsumo(null);
    } catch {
      toast.error('Não foi possível atualizar o insumo.');
      throw new Error('edit-insumo-failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingInsumo) return;
    try {
      await estoque.deleteInsumo(deletingInsumo.id);
      toast.success(`Insumo ${deletingInsumo.nome} excluído com sucesso!`);
      setDeletingInsumo(null);
    } catch {
      toast.error('Não foi possível excluir o insumo.');
    }
  };

  // Handlers de Fornecedores
  const handleAddFornecedor = async (novo: NovoFornecedor) => {
    try {
      await fornecedoresHook.addFornecedor(novo);
      toast.success('Fornecedor cadastrado com sucesso!');
    } catch {
      toast.error('Não foi possível cadastrar o fornecedor.');
      throw new Error('add-fornecedor-failed');
    }
  };

  const handleEditFornecedor = async (dados: NovoFornecedor) => {
    if (!editingFornecedor) return;
    try {
      await fornecedoresHook.editFornecedor(editingFornecedor.id, dados);
      toast.success('Fornecedor atualizado com sucesso!');
      setEditingFornecedor(null);
    } catch {
      toast.error('Não foi possível atualizar o fornecedor.');
      throw new Error('edit-fornecedor-failed');
    }
  };

  const handleConfirmDeleteFornecedor = async () => {
    if (!deletingFornecedor) return;
    try {
      await fornecedoresHook.deleteFornecedor(deletingFornecedor.id);
      toast.success(`Fornecedor ${deletingFornecedor.nome} removido com sucesso!`);
      setDeletingFornecedor(null);
    } catch {
      toast.error('Não foi possível remover o fornecedor.');
    }
  };

  const fornecedoresNomes = fornecedoresHook.fornecedores.map((f) => f.nome);

  return (
    <AppShell activeModule="estoque">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start w-full pb-20 md:pb-0">
        <EstoqueSidebar
          active={activeSubModule}
          lowStockCount={estoque.lowStockCount}
          lowWeighedCount={produtosPesadosHook.lowWeighedCount}
          onChange={setActiveSubModule}
        />

        <div className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            {activeSubModule === 'estoque' ? (
              <EstoquePanel
                key="estoque"
                estoque={estoque}
                fornecedores={fornecedoresHook.fornecedores}
                onAddInsumo={() => {
                  setEditingInsumo(null);
                  setShowAddModal(true);
                }}
                onEditInsumo={(insumo) => {
                  setEditingInsumo(insumo);
                }}
                onDeleteInsumo={(insumo) => {
                  setDeletingInsumo(insumo);
                }}
                onNavigateToFornecedores={() => setActiveSubModule('fornecedores')}
                onNavigateToBalanco={() => setActiveSubModule('balanco')}
              />
            ) : activeSubModule === 'produtos-pesados' ? (
              <ProdutosPesadosPanel
                key="produtos-pesados"
                produtosPesados={produtosPesadosHook}
                insumosDisponiveis={estoque.items.map((i) => `${i.nome} (${i.codigo})`)}
              />
            ) : activeSubModule === 'fornecedores' ? (
              <FornecedoresPanel
                key="fornecedores"
                fornecedoresHook={fornecedoresHook}
                onAddFornecedor={() => {
                  setEditingFornecedor(null);
                  setShowAddFornecedorModal(true);
                }}
                onEditFornecedor={(fornecedor) => {
                  setEditingFornecedor(fornecedor);
                }}
                onDeleteFornecedor={(fornecedor) => {
                  setDeletingFornecedor(fornecedor);
                }}
              />
            ) : activeSubModule === 'balanco' ? (
              <BalancoPanel key="balanco" estoque={estoque} />
            ) : (
              <CmvPanel
                key="cmv"
                cmv={cmv}
                estoque={estoque}
                onNavigateToEstoque={() => setActiveSubModule('estoque')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de Cadastro de Insumo */}
      <AddInsumoModal
        open={showAddModal}
        fornecedoresDisponiveis={fornecedoresNomes}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInsumo}
      />

      {/* Modal de Edição de Insumo */}
      <AddInsumoModal
        open={Boolean(editingInsumo)}
        initialData={editingInsumo}
        fornecedoresDisponiveis={fornecedoresNomes}
        onClose={() => setEditingInsumo(null)}
        onSubmit={handleEditInsumo}
      />

      {/* Modal de Confirmação de Exclusão de Insumo */}
      <DeleteInsumoModal
        open={Boolean(deletingInsumo)}
        insumo={deletingInsumo}
        onClose={() => setDeletingInsumo(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal de Cadastro de Fornecedor */}
      <AddFornecedorModal
        open={showAddFornecedorModal}
        onClose={() => setShowAddFornecedorModal(false)}
        onSubmit={handleAddFornecedor}
      />

      {/* Modal de Edição de Fornecedor */}
      <AddFornecedorModal
        open={Boolean(editingFornecedor)}
        initialData={editingFornecedor}
        onClose={() => setEditingFornecedor(null)}
        onSubmit={handleEditFornecedor}
      />

      {/* Modal de Confirmação de Exclusão de Fornecedor */}
      <DeleteFornecedorModal
        open={Boolean(deletingFornecedor)}
        fornecedor={deletingFornecedor}
        onClose={() => setDeletingFornecedor(null)}
        onConfirm={handleConfirmDeleteFornecedor}
      />
    </AppShell>
  );
}
