'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { Insumo } from '../../types';

interface DeleteInsumoModalProps {
  open: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onConfirm: () => Promise<unknown> | void;
}

export function DeleteInsumoModal({ open, insumo, onClose, onConfirm }: DeleteInsumoModalProps) {
  if (!insumo) return null;

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
              aria-labelledby="delete-modal-title"
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
                <h3 id="delete-modal-title" className="text-base font-black text-slate-900">
                  Excluir Insumo?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você tem certeza que deseja excluir <strong>{insumo.nome}</strong> ({insumo.codigo})? Essa ação não pode ser desfeita.
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
