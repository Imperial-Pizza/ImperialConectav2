'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Package,
  Plus,
  Minus,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { Insumo } from '../../types';

interface QuickStockModalProps {
  open: boolean;
  insumo: Insumo | null;
  onClose: () => void;
  onConfirm: (delta: number) => Promise<void> | void;
}

export function QuickStockModal({
  open,
  insumo,
  onClose,
  onConfirm,
}: QuickStockModalProps) {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [quantidade, setQuantidade] = useState<string>('10');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setQuantidade('10');
      setTipo('entrada');
    }
  }, [open]);

  if (!insumo) return null;

  const qtdAtual = insumo.qtd;
  const valorQtd = parseFloat(quantidade) || 0;
  const delta = tipo === 'entrada' ? valorQtd : -valorQtd;
  const novoSaldo = Math.max(0, Number((qtdAtual + delta).toFixed(2)));
  const passaraParaNormal = qtdAtual <= insumo.min && novoSaldo > insumo.min;
  const passaraParaBaixo = qtdAtual > insumo.min && novoSaldo <= insumo.min;

  const handleFastAdd = (val: number) => {
    setQuantidade(String(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valorQtd <= 0) return;

    setIsSaving(true);
    try {
      await onConfirm(delta);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const fastValues = tipo === 'entrada' ? [5, 10, 20, 50] : [1, 2, 5, 10];

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
            aria-labelledby="quick-stock-title"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200 shrink-0">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3
                    id="quick-stock-title"
                    className="text-base font-black text-slate-900"
                  >
                    Movimentar Estoque
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {insumo.nome} ({insumo.unidade})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alternador: Entrada (+) vs Saída (-) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tipo === 'entrada'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Entrada (+)</span>
              </button>
              <button
                type="button"
                onClick={() => setTipo('saida')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tipo === 'saida'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Saída / Baixa (-)</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Quantidade */}
              <div>
                <label
                  htmlFor="quick-quantidade"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Quantidade a {tipo === 'entrada' ? 'adicionar' : 'dar baixa'} ({insumo.unidade})
                </label>
                <div className="relative">
                  <input
                    id="quick-quantidade"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-black font-mono focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 bg-slate-50 focus:bg-white text-slate-800"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400 uppercase">
                    {insumo.unidade}
                  </span>
                </div>
              </div>

              {/* Botões de atalho rápido */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Atalhos:
                </span>
                {fastValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleFastAdd(val)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    {tipo === 'entrada' ? `+${val}` : `-${val}`} {insumo.unidade}
                  </button>
                ))}
              </div>

              {/* Caixa de Pré-visualização do Saldo */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estoque Atual:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {qtdAtual} {insumo.unidade}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Movimentação:</span>
                  <span
                    className={`font-black font-mono ${
                      tipo === 'entrada' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {tipo === 'entrada' ? `+${valorQtd}` : `-${valorQtd}`} {insumo.unidade}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Novo Saldo Previsto:</span>
                  <span className="font-black font-mono text-base text-slate-900">
                    {novoSaldo} {insumo.unidade}
                  </span>
                </div>

                {passaraParaNormal && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Estoque sairá do nível crítico e voltará a ficar normal!</span>
                  </p>
                )}

                {passaraParaBaixo && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1 pt-1">
                    <span>⚠️ Atenção: Saldo ficará abaixo do mínimo ({insumo.min} {insumo.unidade}).</span>
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving || valorQtd <= 0}
                  className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gravando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Confirmar Movimentação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </Portal>
  );
}
