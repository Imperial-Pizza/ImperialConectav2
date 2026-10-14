'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { AppShell } from '@/layouts/AppShell';

import { EstoqueSidebar } from './Sidebar/EstoqueSidebar';
import { EstoquePanel } from './Estoque/EstoquePanel';
import { CmvPanel } from './Cmv/CmvPanel';
import { AddInsumoModal } from './Modals/AddInsumoModal';
import { DeleteInsumoModal } from './Modals/DeleteInsumoModal';
import { useEstoque } from '../hooks/useEstoque';
import { useCmv } from '../hooks/useCmv';
import type { EstoqueSubModule, Insumo, NovoInsumo } from '../types';

export default function EstoqueView() {
  const [activeSubModule, setActiveSubModule] = useState<EstoqueSubModule>('estoque');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [deletingInsumo, setDeletingInsumo] = useState<Insumo | null>(null);

  const estoque = useEstoque();
  const cmv = useCmv();

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

  return (
    <AppShell activeModule="estoque">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-8">
        <EstoqueSidebar active={activeSubModule} onChange={setActiveSubModule} />

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeSubModule === 'estoque' ? (
              <EstoquePanel
                key="estoque"
                estoque={estoque}
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
              />
            ) : (
              <CmvPanel key="cmv" cmv={cmv} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <AddInsumoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInsumo}
      />

      {/* Modal de Edição */}
      <AddInsumoModal
        open={Boolean(editingInsumo)}
        initialData={editingInsumo}
        onClose={() => setEditingInsumo(null)}
        onSubmit={handleEditInsumo}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteInsumoModal
        open={Boolean(deletingInsumo)}
        insumo={deletingInsumo}
        onClose={() => setDeletingInsumo(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
}
