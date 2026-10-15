'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Package, Hash, Building2, Tag, Layers, DollarSign, AlertCircle, FileText } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';

import { CATEGORIAS_INSUMO, UNIDADES_INSUMO } from '../../utils/constants';
import type { Insumo, NovoInsumo } from '../../types';

interface InsumoModalProps {
  open: boolean;
  initialData?: Insumo | null;
  fornecedoresDisponiveis?: string[];
  onClose: () => void;
  onSubmit: (insumo: NovoInsumo) => Promise<unknown> | void;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 font-medium transition-all';

export function AddInsumoModal({
  open,
  initialData,
  fornecedoresDisponiveis = [],
  onClose,
  onSubmit,
}: InsumoModalProps) {
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    categoria: CATEGORIAS_INSUMO[0] as string,
    unidade: UNIDADES_INSUMO[0] as string,
    qtd: '',
    custo: '',
    min: '',
    fornecedor: '',
    observacoes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        codigo: initialData.codigo || '',
        nome: initialData.nome || '',
        categoria: initialData.categoria || CATEGORIAS_INSUMO[0],
        unidade: initialData.unidade || UNIDADES_INSUMO[0],
        qtd: String(initialData.qtd ?? ''),
        custo: String(initialData.custoUnitario ?? ''),
        min: String(initialData.min ?? ''),
        fornecedor: initialData.fornecedor || '',
        observacoes: initialData.observacoes || '',
      });
    } else {
      setForm({
        codigo: `INS-${Math.floor(100 + Math.random() * 900)}`,
        nome: '',
        categoria: CATEGORIAS_INSUMO[0] as string,
        unidade: UNIDADES_INSUMO[0] as string,
        qtd: '',
        custo: '',
        min: '10',
        fornecedor: '',
        observacoes: '',
      });
    }
  }, [initialData, open]);

  const update = (campo: string, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.qtd || !form.custo) return;

    setIsSaving(true);
    try {
      await onSubmit({
        codigo: form.codigo.trim() || `INS-${Date.now().toString().slice(-4)}`,
        nome: form.nome.trim(),
        categoria: form.categoria,
        unidade: form.unidade,
        qtd: parseFloat(form.qtd) || 0,
        custoUnitario: parseFloat(form.custo) || 0,
        min: parseFloat(form.min) || 5,
        fornecedor: form.fornecedor.trim() || 'Fornecedor Padrão',
        observacoes: form.observacoes.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
          >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="insumo-modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200/90 my-8"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="insumo-modal-title" className="text-base sm:text-lg font-black text-slate-900">
                    {isEditing ? 'Editar Insumo' : 'Cadastrar Novo Insumo'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isEditing ? 'Atualize as informações de estoque e fornecedor' : 'Preencha os campos da ficha de estoque'}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Código & Nome do Produto */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="insumo-codigo" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>Código</span>
                  </label>
                  <input
                    id="insumo-codigo"
                    type="text"
                    value={form.codigo}
                    onChange={(e) => update('codigo', e.target.value)}
                    placeholder="Ex: INS-001"
                    className={`${inputClass} font-mono font-bold`}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="insumo-nome" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Produto / Insumo</span>
                  </label>
                  <input
                    id="insumo-nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    placeholder="Ex: Muçarela em Barra Especial"
                    className={inputClass}
                    required
                    autoFocus={!isEditing}
                  />
                </div>
              </div>

              {/* Categoria & Unidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="insumo-categoria" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Categoria</span>
                  </label>
                  <select
                    id="insumo-categoria"
                    value={form.categoria}
                    onChange={(e) => update('categoria', e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORIAS_INSUMO.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="insumo-unidade" className="block text-xs font-bold text-slate-700 mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    id="insumo-unidade"
                    value={form.unidade}
                    onChange={(e) => update('unidade', e.target.value)}
                    className={inputClass}
                  >
                    {UNIDADES_INSUMO.map((un) => (
                      <option key={un} value={un}>{un}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantidade Atual, Custo Unitário & Estoque Mínimo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="insumo-qtd" className="block text-xs font-bold text-slate-700 mb-1">
                    Qtd. Atual
                  </label>
                  <input
                    id="insumo-qtd"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.qtd}
                    onChange={(e) => update('qtd', e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} font-mono`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="insumo-custo" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preço Médio (R$)</span>
                  </label>
                  <input
                    id="insumo-custo"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.custo}
                    onChange={(e) => update('custo', e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} font-mono`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="insumo-min" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Estoque Mínimo</span>
                  </label>
                  <input
                    id="insumo-min"
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.min}
                    onChange={(e) => update('min', e.target.value)}
                    placeholder="5"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* Fornecedor Principal */}
              <div>
                <label htmlFor="insumo-fornecedor" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fornecedor Principal</span>
                </label>
                <input
                  id="insumo-fornecedor"
                  type="text"
                  list="fornecedores-sugestoes"
                  value={form.fornecedor}
                  onChange={(e) => update('fornecedor', e.target.value)}
                  placeholder="Ex: Laticínios Scala / Moinho Caputo"
                  className={inputClass}
                />
                {fornecedoresDisponiveis.length > 0 && (
                  <datalist id="fornecedores-sugestoes">
                    {fornecedoresDisponiveis.map((f) => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                )}
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="insumo-observacoes" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Observações (opcional)</span>
                </label>
                <textarea
                  id="insumo-observacoes"
                  rows={2}
                  value={form.observacoes}
                  onChange={(e) => update('observacoes', e.target.value)}
                  placeholder="Ex: Manter refrigerado entre 1°C e 4°C..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Salvar Insumo'}
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
