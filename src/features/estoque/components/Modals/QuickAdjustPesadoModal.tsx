'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Minus,
  Plus,
  Scale,
  X,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { ProdutoPesado } from '../../types';

interface QuickAdjustPesadoModalProps {
  open: boolean;
  item: ProdutoPesado | null;
  onClose: () => void;
  onConfirm: (deltaPacotes: number) => Promise<void> | void;
}

export function QuickAdjustPesadoModal({
  open,
  item,
  onClose,
  onConfirm,
}: QuickAdjustPesadoModalProps) {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [pacotes, setPacotes] = useState<string>('1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPacotes('1');
      setTipo('entrada');
    }
  }, [open]);

  if (!open || !item) return null;

  const pacotesAtuais = item.quantidadePacotes;
  const numPacotes = parseInt(pacotes, 10) || 0;
  const delta = tipo === 'entrada' ? numPacotes : -numPacotes;
  const novosPacotes = Math.max(0, pacotesAtuais + delta);
  const novoPesoTotal = Number((novosPacotes * item.pesoUnitarioKg).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numPacotes <= 0) return;

    setIsSaving(true);
    try {
      await onConfirm(delta);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

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
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Ajuste Rápido de Pacotes
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.nome}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Tipo: Entrada (Pesagem nova) vs Saída (Uso na linha) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tipo === 'entrada'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>+ Produção / Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo('saida')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tipo === 'saida'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>- Consumo Linha</span>
              </button>
            </div>

            {/* Atalhos Rápidos de Pacotes */}
            <div className="flex items-center justify-between gap-1.5">
              {[1, 2, 3, 5, 10].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPacotes(String(v))}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    pacotes === String(v)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {v} pct
                </button>
              ))}
            </div>

            {/* Campo Quantidade de Pacotes */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Quantidade de pacotes de {item.pesoUnitarioKg}kg
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={pacotes}
                    onChange={(e) => setPacotes(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    pcts
                  </span>
                </div>
              </div>

              {/* Saldo Calculado */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Pacotes Atuais:</span>
                  <span className="font-bold text-slate-800">
                    {pacotesAtuais} pcts ({item.pesoTotalKg} kg)
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                  <span>Novo Saldo:</span>
                  <span
                    className={
                      tipo === 'entrada' ? 'text-emerald-600 font-mono' : 'text-slate-900 font-mono'
                    }
                  >
                    {novosPacotes} pcts ({novoPesoTotal} kg)
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || numPacotes <= 0}
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 ${
                    tipo === 'entrada'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                  }`}
                >
                  {isSaving ? 'Salvando...' : 'Confirmar Ajuste'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
