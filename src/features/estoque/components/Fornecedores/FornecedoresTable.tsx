'use client';

import {
  Building2,
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

interface FornecedoresTableProps {
  items: Fornecedor[];
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (fornecedor: Fornecedor) => void;
  onToggleStatus: (id: number) => void;
}

export function FornecedoresTable({
  items,
  onEdit,
  onDelete,
  onToggleStatus,
}: FornecedoresTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isAtivo = item.status === 'ativo';
        const rawPhone = item.telefone.replace(/\D/g, '');
        const whatsappUrl = rawPhone
          ? `https://wa.me/55${rawPhone}?text=${encodeURIComponent(
              `Olá ${item.contatoNome || ''}, falo da Imperial Pizza sobre nossos pedidos.`
            )}`
          : null;

        const codNum = String(item.id).padStart(3, '0');

        return (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Lado Esquerdo: Box de Código/Status + Informações do Fornecedor */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box estilo CMD */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
                    FOR
                  </span>
                  <span className="text-base font-black font-mono text-indigo-700 leading-none">
                    {codNum}
                  </span>
                </div>

                {/* Status Pill */}
                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id)}
                  title="Clique para alternar o status"
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 cursor-pointer transition-colors ${
                    isAtivo
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
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

              {/* Informações Centrais */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Linha 1: Nome + Categoria + CNPJ + Local */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {item.nome}
                  </h3>

                  {/* Badge da Categoria */}
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3 text-amber-600" />
                    {item.categoria}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                    {item.cnpj || 'Sem CNPJ'}
                  </span>

                  {item.cidade && (
                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.cidade}{item.estado ? `/${item.estado}` : ''}
                    </span>
                  )}
                </div>

                {/* Linha 2: Razão Social ou Descrição */}
                {item.razaoSocial && (
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    Razão Social: {item.razaoSocial}
                  </p>
                )}

                {/* Linha 3: Contatos e Condições Comerciais */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  {item.contatoNome && (
                    <>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.contatoNome}
                      </span>
                      <span className="text-slate-300">•</span>
                    </>
                  )}

                  {item.telefone && (
                    <>
                      <span className="font-mono text-slate-700 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {item.telefone}
                      </span>
                      <span className="text-slate-300">•</span>
                    </>
                  )}

                  {item.prazoEntrega && (
                    <>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        Prazo: <strong className="text-slate-700">{item.prazoEntrega}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                    </>
                  )}

                  {item.condicaoPagamento && (
                    <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60 text-[11px]">
                      {item.condicaoPagamento}
                    </span>
                  )}
                </div>

                {/* Linha 4: Insumos Fornecidos */}
                {item.insumosVinculados && item.insumosVinculados.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Insumos:
                    </span>
                    {item.insumosVinculados.map((insumo) => (
                      <span
                        key={insumo}
                        className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {insumo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito: Ações */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
              {/* Botão WhatsApp direto */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir conversa no WhatsApp"
                  className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}

              {/* Botão Email direto */}
              {item.email && (
                <a
                  href={`mailto:${item.email}`}
                  title={`Enviar email para ${item.email}`}
                  className="w-10 h-10 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}

              {/* Botão Editar */}
              <button
                type="button"
                onClick={() => onEdit(item)}
                title={`Editar fornecedor ${item.nome}`}
                aria-label={`Editar fornecedor ${item.nome}`}
                className="w-10 h-10 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Botão Excluir */}
              <button
                type="button"
                onClick={() => onDelete(item)}
                title={`Excluir fornecedor ${item.nome}`}
                aria-label={`Excluir fornecedor ${item.nome}`}
                className="w-10 h-10 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
