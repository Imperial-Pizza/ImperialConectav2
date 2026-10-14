'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { AppShell } from '@/layouts/AppShell';

import { EstoqueSidebar } from './Sidebar/EstoqueSidebar';
import { EstoquePanel } from './Estoque/EstoquePanel';
import { CmvPanel } from './Cmv/CmvPanel';
import { AddInsumoModal } from './Modals/AddInsumoModal';
import { useEstoque } from '../hooks/useEstoque';
import { useCmv } from '../hooks/useCmv';
import type { EstoqueSubModule, NovoInsumo } from '../types';

export default function EstoqueView() {
  const [activeSubModule, setActiveSubModule] = useState<EstoqueSubModule>('estoque');
  const [showAddModal, setShowAddModal] = useState(false);

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
                onAddInsumo={() => setShowAddModal(true)}
              />
            ) : (
              <CmvPanel key="cmv" cmv={cmv} />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AddInsumoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddInsumo}
      />
    </AppShell>
  );
}
