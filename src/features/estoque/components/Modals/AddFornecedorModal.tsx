'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Tag,
  Truck,
  User,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { CustomSelect } from '@/components/ui/CustomSelect';

import { CATEGORIAS_FORNECEDOR } from '../../utils/constants';
import type { Fornecedor, NovoFornecedor } from '../../types';

interface FornecedorModalProps {
  open: boolean;
  initialData?: Fornecedor | null;
  onClose: () => void;
  onSubmit: (fornecedor: NovoFornecedor) => Promise<unknown> | void;
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 font-medium transition-all';

export function AddFornecedorModal({
  open,
  initialData,
  onClose,
  onSubmit,
}: FornecedorModalProps) {
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    nome: '',
    razaoSocial: '',
    cnpj: '',
    categoria: CATEGORIAS_FORNECEDOR[0] as string,
    contatoNome: '',
    telefone: '',
    email: '',
    cidade: 'São Paulo',
    estado: 'SP',
    prazoEntrega: '24h a 48h',
    condicaoPagamento: 'Boleto 28 dias',
    status: 'ativo' as 'ativo' | 'inativo',
    insumosTexto: '',
    observacoes: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        nome: initialData.nome || '',
        razaoSocial: initialData.razaoSocial || '',
        cnpj: initialData.cnpj || '',
        categoria: initialData.categoria || CATEGORIAS_FORNECEDOR[0],
        contatoNome: initialData.contatoNome || '',
        telefone: initialData.telefone || '',
        email: initialData.email || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || 'SP',
        prazoEntrega: initialData.prazoEntrega || '',
        condicaoPagamento: initialData.condicaoPagamento || '',
        status: initialData.status || 'ativo',
        insumosTexto: (initialData.insumosVinculados || []).join(', '),
        observacoes: initialData.observacoes || '',
      });
    } else {
      setForm({
        nome: '',
        razaoSocial: '',
        cnpj: '',
        categoria: CATEGORIAS_FORNECEDOR[0] as string,
        contatoNome: '',
        telefone: '',
        email: '',
        cidade: 'São Paulo',
        estado: 'SP',
        prazoEntrega: '24h a 48h',
        condicaoPagamento: 'Boleto 28 dias',
        status: 'ativo',
        insumosTexto: '',
        observacoes: '',
      });
    }
  }, [initialData, open]);

  const update = (campo: string, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) return;

    setIsSaving(true);
    try {
      const insumosArray = form.insumosTexto
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await onSubmit({
        nome: form.nome.trim(),
        razaoSocial: form.razaoSocial.trim() || undefined,
        cnpj: form.cnpj.trim(),
        categoria: form.categoria,
        contatoNome: form.contatoNome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim().toUpperCase() || 'SP',
        prazoEntrega: form.prazoEntrega.trim(),
        condicaoPagamento: form.condicaoPagamento.trim(),
        status: form.status,
        insumosVinculados: insumosArray.length > 0 ? insumosArray : undefined,
        observacoes: form.observacoes.trim() || undefined,
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
            aria-labelledby="fornecedor-modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200/90 my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="fornecedor-modal-title"
                    className="text-base sm:text-lg font-black text-slate-900"
                  >
                    {isEditing ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isEditing
                      ? 'Atualize os dados comerciais e de contato da distribuidora'
                      : 'Preencha a ficha cadastral do parceiro de suprimentos'}
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
              {/* Linha 1: Nome Fantasia e Razão Social */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="fornecedor-nome"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nome Fantasia *</span>
                  </label>
                  <input
                    id="fornecedor-nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    placeholder="Ex: Laticínios Scala"
                    className={inputClass}
                    required
                    autoFocus={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-razao"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Razão Social
                  </label>
                  <input
                    id="fornecedor-razao"
                    type="text"
                    value={form.razaoSocial}
                    onChange={(e) => update('razaoSocial', e.target.value)}
                    placeholder="Ex: Indústria Scala S/A"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Linha 2: CNPJ, Categoria e Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="fornecedor-cnpj"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    CNPJ / Documento
                  </label>
                  <input
                    id="fornecedor-cnpj"
                    type="text"
                    value={form.cnpj}
                    onChange={(e) => update('cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-categoria"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Categoria</span>
                  </label>
                  <CustomSelect
                    value={form.categoria}
                    onChange={(val) => update('categoria', val)}
                    options={CATEGORIAS_FORNECEDOR.map((cat) => ({ value: cat, label: cat }))}
                    fullWidth
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border-slate-200 text-slate-800 text-xs py-2.5"
                    activeColorClass="bg-slate-50/70 border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-status"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Status
                  </label>
                  <CustomSelect
                    value={form.status}
                    onChange={(val) => update('status', val as 'ativo' | 'inativo')}
                    options={[
                      { value: 'ativo', label: 'Ativo' },
                      { value: 'inativo', label: 'Inativo' },
                    ]}
                    fullWidth
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border-slate-200 text-slate-800 text-xs py-2.5"
                    activeColorClass="bg-slate-50/70 border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              {/* Linha 3: Contato, Telefone / WhatsApp e Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="fornecedor-contato"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Representante</span>
                  </label>
                  <input
                    id="fornecedor-contato"
                    type="text"
                    value={form.contatoNome}
                    onChange={(e) => update('contatoNome', e.target.value)}
                    placeholder="Ex: Carlos Mendes"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-telefone"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>WhatsApp / Telefone</span>
                  </label>
                  <input
                    id="fornecedor-telefone"
                    type="text"
                    value={form.telefone}
                    onChange={(e) => update('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-email"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>E-mail</span>
                  </label>
                  <input
                    id="fornecedor-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="pedidos@empresa.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Linha 4: Localização (Cidade & Estado) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fornecedor-cidade"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cidade</span>
                  </label>
                  <input
                    id="fornecedor-cidade"
                    type="text"
                    value={form.cidade}
                    onChange={(e) => update('cidade', e.target.value)}
                    placeholder="Ex: São Paulo"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-estado"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    UF
                  </label>
                  <input
                    id="fornecedor-estado"
                    type="text"
                    maxLength={2}
                    value={form.estado}
                    onChange={(e) => update('estado', e.target.value.toUpperCase())}
                    placeholder="SP"
                    className={`${inputClass} font-mono uppercase`}
                  />
                </div>
              </div>

              {/* Linha 5: Prazo de Entrega e Condição de Pagamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="fornecedor-prazo"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prazo Médio de Entrega</span>
                  </label>
                  <input
                    id="fornecedor-prazo"
                    type="text"
                    value={form.prazoEntrega}
                    onChange={(e) => update('prazoEntrega', e.target.value)}
                    placeholder="Ex: 24h a 48h / Toda terça"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fornecedor-pagamento"
                    className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Condições de Pagamento</span>
                  </label>
                  <input
                    id="fornecedor-pagamento"
                    type="text"
                    value={form.condicaoPagamento}
                    onChange={(e) => update('condicaoPagamento', e.target.value)}
                    placeholder="Ex: Boleto 28 dias / PIX à vista"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Linha 6: Insumos Homologados */}
              <div>
                <label
                  htmlFor="fornecedor-insumos"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Insumos Fornecidos (separar por vírgula)</span>
                </label>
                <input
                  id="fornecedor-insumos"
                  type="text"
                  value={form.insumosTexto}
                  onChange={(e) => update('insumosTexto', e.target.value)}
                  placeholder="Ex: Muçarela em Peça, Parmesão Ralado, Catupiry"
                  className={inputClass}
                />
              </div>

              {/* Linha 7: Observações */}
              <div>
                <label
                  htmlFor="fornecedor-observacoes"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Observações (opcional)</span>
                </label>
                <textarea
                  id="fornecedor-observacoes"
                  rows={2}
                  value={form.observacoes}
                  onChange={(e) => update('observacoes', e.target.value)}
                  placeholder="Ex: Pedido mínimo de R$ 800, entregar pela manhã na câmara fria..."
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
                      <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}</span>
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
