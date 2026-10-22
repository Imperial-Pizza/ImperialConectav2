'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Package, Hash, Building2, Tag, Layers, DollarSign, AlertCircle, FileText, Save, Loader2, ChevronDown, Check } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { CustomSelect } from '@/components/ui/CustomSelect';

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
  const [showFornecedoresList, setShowFornecedoresList] = useState(false);
  const fornecedoresRef = useRef<HTMLDivElement>(null);

  const fornecedoresFiltrados = fornecedoresDisponiveis.filter((f) =>
    f.toLowerCase().includes(form.fornecedor.toLowerCase())
  );

  // Fecha a lista de fornecedores ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (fornecedoresRef.current && !fornecedoresRef.current.contains(event.target as Node)) {
        setShowFornecedoresList(false);
      }
    }
    if (showFornecedoresList) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showFornecedoresList]);

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
                  <CustomSelect
                    value={form.categoria}
                    onChange={(val) => update('categoria', val)}
                    options={CATEGORIAS_INSUMO.map((cat) => ({ value: cat, label: cat }))}
                    fullWidth
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border-slate-200 text-slate-800 text-xs py-2.5"
                    activeColorClass="bg-slate-50/70 border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="insumo-unidade" className="block text-xs font-bold text-slate-700 mb-1">
                    Unidade de Medida
                  </label>
                  <CustomSelect
                    value={form.unidade}
                    onChange={(val) => update('unidade', val)}
                    options={UNIDADES_INSUMO.map((un) => ({ value: un, label: un }))}
                    fullWidth
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border-slate-200 text-slate-800 text-xs py-2.5"
                    activeColorClass="bg-slate-50/70 border-slate-200 text-slate-800"
                  />
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

              {/* Fornecedor Principal (Autocomplete / Selecionável Elegante) */}
              <div ref={fornecedoresRef} className="relative">
                <label htmlFor="insumo-fornecedor" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fornecedor Principal</span>
                  </span>
                  {form.fornecedor && (
                    <button
                      type="button"
                      onClick={() => update('fornecedor', '')}
                      className="text-[10px] text-slate-400 hover:text-red-500 font-semibold cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="insumo-fornecedor"
                    type="text"
                    value={form.fornecedor}
                    onChange={(e) => {
                      update('fornecedor', e.target.value);
                      setShowFornecedoresList(true);
                    }}
                    onFocus={() => setShowFornecedoresList(true)}
                    placeholder="Ex: Laticínios Scala / Moinho Caputo"
                    className={`${inputClass} pr-9`}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowFornecedoresList((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showFornecedoresList ? 'rotate-180 text-slate-700' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown customizado de sugestões */}
                <AnimatePresence>
                  {showFornecedoresList && fornecedoresFiltrados.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xl shadow-slate-900/10 z-50 max-h-52 overflow-y-auto space-y-0.5"
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                        Fornecedores Cadastrados
                      </div>
                      {fornecedoresFiltrados.map((f) => {
                        const isSelected = form.fornecedor === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              update('fornecedor', f);
                              setShowFornecedoresList(false);
                            }}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                              isSelected
                                ? 'bg-blue-50/80 text-blue-900 font-bold'
                                : 'text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'Salvar Alterações' : 'Salvar Insumo'}</span>
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
