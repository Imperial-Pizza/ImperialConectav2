'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, CheckCircle2, Loader2, Save, X } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { ItemBalanco } from '../../types';

interface FinalizarBalancoModalProps {
  open: boolean;
  itens: ItemBalanco[];
  metrics: {
    totalItens: number;
    contadosCount: number;
    pendentesCount: number;
    divergentesCount: number;
    bateuCount: number;
    totalPerdas: number;
    totalSobras: number;
    impactoLiquido: number;
    percentualAcuracia: number;
  };
  onClose: () => void;
  onConfirm: (responsavel: string) => Promise<void>;
}

export function FinalizarBalancoModal({
  open,
  itens,
  metrics,
  onClose,
  onConfirm,
}: FinalizarBalancoModalProps) {
  const [responsavel, setResponsavel] = useState('João Gerente');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const itensContados = itens.filter((i) => i.qtdFisica !== null);
  const itensAlterados = itensContados.filter((i) => i.divergenciaQtd !== 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onConfirm(responsavel);
      onClose();
    } catch {
      // Handled by caller toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Finalizar Balanço de Estoque
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Revise os números antes de sincronizar as quantidades com o estoque oficial
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Responsável */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Responsável pela Contagem / Auditoria
                </label>
                <input
                  type="text"
                  required
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do gerente ou encarregado"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Itens Conferidos
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {itensContados.length}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Divergências
                  </span>
                  <p className="text-xl font-black text-red-600 font-mono mt-0.5">
                    {metrics.divergentesCount}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Impacto Líquido
                  </span>
                  <p
                    className={`text-xl font-black font-mono mt-0.5 ${
                      metrics.impactoLiquido < 0
                        ? 'text-red-600'
                        : metrics.impactoLiquido > 0
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {metrics.impactoLiquido < 0
                      ? `- ${formatCurrency(Math.abs(metrics.impactoLiquido))}`
                      : formatCurrency(metrics.impactoLiquido)}
                  </p>
                </div>
              </div>

              {/* Alerta de Ajuste */}
              {itensAlterados.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>
                      {itensAlterados.length}{' '}
                      {itensAlterados.length === 1 ? 'insumo terá' : 'insumos terão'} o saldo atualizado:
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                    {itensAlterados.map((item) => (
                      <div
                        key={item.insumoId}
                        className="p-3 flex items-center justify-between gap-3 bg-white"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.nome}</p>
                          <p className="text-[11px] text-slate-400">
                            Sistema: {item.qtdSistema} {item.unidade} ➔ Físico:{' '}
                            <strong className="text-slate-800">{item.qtdFisica} {item.unidade}</strong>
                          </p>
                          {item.motivo && (
                            <p className="text-[10px] text-red-600 italic mt-0.5">
                              Motivo: {item.motivo}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0 font-mono">
                          <span
                            className={`font-black text-xs ${
                              item.divergenciaQtd < 0 ? 'text-red-600' : 'text-amber-600'
                            }`}
                          >
                            {item.divergenciaQtd > 0 ? `+${item.divergenciaQtd}` : item.divergenciaQtd}{' '}
                            {item.unidade}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {formatCurrency(item.divergenciaValor)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Estoque perfeito! Todos os insumos contados bateram 100% com o sistema.
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>Voltar e Conferir</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-black shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Confirmar & Sincronizar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
