'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { Fornecedor } from '../../types';

interface DeleteFornecedorModalProps {
  open: boolean;
  fornecedor: Fornecedor | null;
  onClose: () => void;
  onConfirm: () => Promise<unknown> | void;
}

export function DeleteFornecedorModal({
  open,
  fornecedor,
  onClose,
  onConfirm,
}: DeleteFornecedorModalProps) {
  if (!fornecedor) return null;

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-fornecedor-title"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3
                  id="delete-fornecedor-title"
                  className="text-base font-black text-slate-900"
                >
                  Excluir Fornecedor?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você tem certeza que deseja remover o cadastro de{' '}
                  <strong className="text-slate-800">{fornecedor.nome}</strong>?
                  Os insumos já vinculados no estoque não serão excluídos.
                </p>
              </div>

              <div className="flex justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
