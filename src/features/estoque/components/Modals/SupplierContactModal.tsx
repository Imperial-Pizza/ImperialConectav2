'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Clock,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react';
import type { Fornecedor, Insumo } from '../../types';

interface SupplierContactModalProps {
  open: boolean;
  insumo: Insumo | null;
  fornecedores: Fornecedor[];
  onClose: () => void;
  onNavigateToFornecedores?: () => void;
}

export function SupplierContactModal({
  open,
  insumo,
  fornecedores,
  onClose,
  onNavigateToFornecedores,
}: SupplierContactModalProps) {
  if (!insumo) return null;

  // Localiza o fornecedor correspondente pelo nome
  const fornecedorNome = insumo.fornecedor?.trim() || '';
  const fornecedor = fornecedores.find(
    (f) =>
      f.nome.toLocaleLowerCase('pt-BR') === fornecedorNome.toLocaleLowerCase('pt-BR') ||
      fornecedorNome.toLocaleLowerCase('pt-BR').includes(f.nome.toLocaleLowerCase('pt-BR'))
  );

  const rawPhone = fornecedor?.telefone?.replace(/\D/g, '') || '';
  const mensagemWhatsApp = encodeURIComponent(
    `Olá ${fornecedor?.contatoNome || 'Fornecedor'}, aqui é da Imperial Pizza! Nosso estoque de "${insumo.nome}" está com ${insumo.qtd} ${insumo.unidade} (mínimo: ${insumo.min} ${insumo.unidade}). Gostaríamos de solicitar uma reposição. Pode nos passar as condições e prazo?`
  );

  const whatsappUrl = rawPhone ? `https://wa.me/55${rawPhone}?text=${mensagemWhatsApp}` : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-contact-title"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="supplier-contact-title"
                    className="text-base font-black text-slate-900"
                  >
                    Contato do Fornecedor
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Insumo: {insumo.nome}
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

            {/* Informações do Fornecedor */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm">
                    {fornecedor?.nome || insumo.fornecedor || 'Fornecedor Padrão'}
                  </h4>
                  {fornecedor?.categoria && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {fornecedor.categoria}
                    </span>
                  )}
                </div>

                {fornecedor?.razaoSocial && (
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {fornecedor.razaoSocial}
                  </p>
                )}

                {fornecedor?.cnpj && (
                  <p className="text-[11px] font-mono text-slate-500">
                    CNPJ: {fornecedor.cnpj}
                  </p>
                )}
              </div>

              {/* Dados Comerciais e de Contato */}
              <div className="space-y-2.5 text-xs text-slate-600">
                {fornecedor?.contatoNome && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <User className="w-3.5 h-3.5" /> Representante:
                    </span>
                    <span className="font-bold text-slate-800">{fornecedor.contatoNome}</span>
                  </div>
                )}

                {fornecedor?.telefone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Phone className="w-3.5 h-3.5" /> Telefone:
                    </span>
                    <span className="font-mono font-bold text-slate-800">{fornecedor.telefone}</span>
                  </div>
                )}

                {fornecedor?.email && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Mail className="w-3.5 h-3.5" /> E-mail:
                    </span>
                    <a
                      href={`mailto:${fornecedor.email}`}
                      className="font-medium text-blue-600 hover:underline truncate max-w-[200px]"
                    >
                      {fornecedor.email}
                    </a>
                  </div>
                )}

                {fornecedor?.cidade && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> Local:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {fornecedor.cidade} - {fornecedor.estado}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" /> Prazo
                    </span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">
                      {fornecedor?.prazoEntrega || '24h a 48h'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-purple-500" /> Pagamento
                    </span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                      {fornecedor?.condicaoPagamento || 'A combinar'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Reposição via WhatsApp */}
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Pedir Reposição no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700 font-medium">
                  Telefone de contato ainda não cadastrado para este fornecedor.
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              {onNavigateToFornecedores && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToFornecedores();
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Abrir Gestão de Fornecedores →
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer ml-auto"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
