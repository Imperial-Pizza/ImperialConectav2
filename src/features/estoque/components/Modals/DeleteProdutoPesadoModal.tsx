'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { ProdutoPesado } from '../../types';

interface DeleteProdutoPesadoModalProps {
  open: boolean;
  item: ProdutoPesado | null;
  onClose: () => void;
  onConfirm: () => Promise<unknown> | void;
}

export function DeleteProdutoPesadoModal({
  open,
  item,
  onClose,
  onConfirm,
}: DeleteProdutoPesadoModalProps) {
  if (!open || !item) return null;

  return (
    <Portal>
      <AnimatePresence>
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
              <h3 className="text-base font-black text-slate-900">
                Remover Produto Pesado?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Você tem certeza que deseja remover <strong>{item.nome}</strong> ({item.lote})? Essa ação excluirá o histórico de pesagem e pacotes em estoque.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
