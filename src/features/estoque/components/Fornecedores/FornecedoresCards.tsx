'use client';

import {
  Building2,
  Calendar,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Tag,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import type { Fornecedor } from '../../types';

interface FornecedoresCardsProps {
  items: Fornecedor[];
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (fornecedor: Fornecedor) => void;
  onToggleStatus: (id: number) => void;
}

export function FornecedoresCards({
  items,
  onEdit,
  onDelete,
  onToggleStatus,
}: FornecedoresCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map((item) => {
        const isAtivo = item.status === 'ativo';
        const rawPhone = item.telefone.replace(/\D/g, '');
        const whatsappUrl = rawPhone
          ? `https://wa.me/55${rawPhone}?text=${encodeURIComponent(
              `Olá ${item.contatoNome || ''}, falo da Imperial Pizza sobre nossos pedidos.`
            )}`
          : null;

        // Iniciais para o avatar
        const initials = item.nome
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <article
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
          >
            {/* Topo do Card */}
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                {/* Avatar e Nome */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
                    {initials || <Building2 className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors truncate">
                      {item.nome}
                    </h3>
                    {item.razaoSocial && (
                      <p className="text-[11px] text-slate-400 font-medium truncate" title={item.razaoSocial}>
                        {item.razaoSocial}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id)}
                  title="Clique para alternar o status do fornecedor"
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAtivo
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAtivo ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span>{isAtivo ? 'Ativo' : 'Inativo'}</span>
                </button>
              </div>

              {/* Tags de Categoria e CNPJ */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1 shrink-0">
                  <Tag className="w-3 h-3 text-amber-600" />
                  {item.categoria}
                </span>

                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 shrink-0">
                  CNPJ: {item.cnpj || 'Não inf.'}
                </span>

                {item.cidade && (
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70 flex items-center gap-1 shrink-0">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.cidade}{item.estado ? ` - ${item.estado}` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Informações de Contato e Condições */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
              {/* Contato Principal */}
              {item.contatoNome && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Representante:
                  </span>
                  <span className="font-bold text-slate-800">{item.contatoNome}</span>
                </div>
              )}

              {/* Telefone / WhatsApp */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contato:
                </span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono font-semibold text-slate-700 truncate">
                    {item.telefone || 'Não informado'}
                  </span>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chamar no WhatsApp"
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>WhatsApp</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Email */}
              {item.email && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    E-mail:
                  </span>
                  <a
                    href={`mailto:${item.email}`}
                    title={item.email}
                    className="font-medium text-blue-600 hover:underline truncate max-w-[200px]"
                  >
                    {item.email}
                  </a>
                </div>
              )}

              {/* Prazos e Condições Comerciais */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/60 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                    <Truck className="w-3 h-3 text-blue-600" />
                    <span>Prazo Entrega</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 font-mono truncate">
                    {item.prazoEntrega || 'Sob consulta'}
                  </p>
                </div>

                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/60 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                    <CreditCard className="w-3 h-3 text-purple-600" />
                    <span>Pagamento</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 font-mono truncate">
                    {item.condicaoPagamento || 'A combinar'}
                  </p>
                </div>
              </div>

              {/* Insumos Homologados */}
              {item.insumosVinculados && item.insumosVinculados.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Insumos Fornecidos:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.insumosVinculados.map((insumo) => (
                      <span
                        key={insumo}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/70"
                      >
                        {insumo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observações */}
              {item.observacoes && (
                <p
                  className="text-[11px] text-slate-500 font-normal italic bg-amber-50/50 p-2 rounded-xl border border-amber-100 line-clamp-2"
                  title={item.observacoes}
                >
                  Obs: {item.observacoes}
                </p>
              )}
            </div>

            {/* Ações Inferiores */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
