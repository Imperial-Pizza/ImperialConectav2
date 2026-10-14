'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { CATEGORIAS_INSUMO, UNIDADES_INSUMO } from '../../utils/constants';
import type { NovoInsumo } from '../../types';

interface AddInsumoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (insumo: NovoInsumo) => Promise<unknown> | void;
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 bg-white';

const INITIAL_FORM = {
  nome: '',
  categoria: CATEGORIAS_INSUMO[0] as string,
  unidade: UNIDADES_INSUMO[0] as string,
  qtd: '',
  custo: '',
  min: '',
};

export function AddInsumoModal({ open, onClose, onSubmit }: AddInsumoModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const update = (campo: keyof typeof INITIAL_FORM, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.qtd || !form.custo) return;

    setIsSaving(true);
    try {
      await onSubmit({
        nome: form.nome.trim(),
        categoria: form.categoria,
        unidade: form.unidade,
        qtd: parseFloat(form.qtd),
        custoUnitario: parseFloat(form.custo),
        min: parseFloat(form.min) || 5,
      });
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-insumo-title"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200"
          >
            <h3 id="add-insumo-title" className="text-lg font-black text-slate-900">
              Cadastrar Novo Insumo
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="insumo-nome" className="block text-xs font-bold text-slate-700 mb-1">Nome do Insumo</label>
                <input
                  id="insumo-nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => update('nome', e.target.value)}
                  placeholder="Ex: Azeite Extra Virgem"
                  className={inputClass}
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="insumo-categoria" className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select id="insumo-categoria" value={form.categoria} onChange={(e) => update('categoria', e.target.value)} className={inputClass}>
                    {CATEGORIAS_INSUMO.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="insumo-unidade" className="block text-xs font-bold text-slate-700 mb-1">Unidade</label>
                  <select id="insumo-unidade" value={form.unidade} onChange={(e) => update('unidade', e.target.value)} className={inputClass}>
                    {UNIDADES_INSUMO.map((un) => (
                      <option key={un} value={un}>{un}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="insumo-qtd" className="block text-xs font-bold text-slate-700 mb-1">Quantidade</label>
                  <input id="insumo-qtd" type="number" min={0} step="0.1" value={form.qtd} onChange={(e) => update('qtd', e.target.value)} placeholder="0.00" className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="insumo-custo" className="block text-xs font-bold text-slate-700 mb-1">Custo Unitário (R$)</label>
                  <input id="insumo-custo" type="number" min={0} step="0.01" value={form.custo} onChange={(e) => update('custo', e.target.value)} placeholder="0.00" className={inputClass} required />
                </div>
              </div>

              <div>
                <label htmlFor="insumo-min" className="block text-xs font-bold text-slate-700 mb-1">Estoque Mínimo para Alerta</label>
                <input id="insumo-min" type="number" min={0} value={form.min} onChange={(e) => update('min', e.target.value)} placeholder="5" className={inputClass} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={handleClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-60">
                  {isSaving ? 'Salvando...' : 'Salvar Insumo'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
