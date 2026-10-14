'use client';

import { Pencil, Trash2, Building2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueCardsProps {
  items: Insumo[];
  onEdit: (insumo: Insumo) => void;
  onDelete: (insumo: Insumo) => void;
}

export function EstoqueCards({ items, onEdit, onDelete }: EstoqueCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const baixo = isEstoqueBaixo(item);
        const total = valorTotalInsumo(item);

        return (
          <article
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              {/* Badges superiores: Código + Categoria + Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    {item.codigo || `INS-${item.id}`}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px] border border-slate-200/60">
                    {item.categoria}
                  </span>
                </div>
                <StatusBadge isBaixo={baixo} compact />
              </div>

              {/* Nome do Produto */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-red-600 transition-colors">
                  {item.nome}
                </h3>
                {item.observacoes && (
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1" title={item.observacoes}>
                    {item.observacoes}
                  </p>
                )}
              </div>
            </div>

            {/* Detalhes do Estoque */}
            <dl className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Qtd. Atual:</dt>
                <dd className="font-bold text-slate-800 font-mono">
                  {item.qtd} {item.unidade}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Estoque Mínimo:</dt>
                <dd className="font-mono text-slate-600">
                  {item.min} {item.unidade}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Preço Médio:</dt>
                <dd className="font-mono text-slate-700">{formatCurrency(item.custoUnitario)}</dd>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                <dt className="font-bold text-slate-900">Valor Total:</dt>
                <dd className="font-black text-red-600 font-mono">
                  {formatCurrency(total)}
                </dd>
              </div>

              {item.fornecedor && (
                <div className="flex items-center gap-1.5 pt-1.5 text-[11px] text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.fornecedor}</span>
                </div>
              )}
            </dl>

            {/* Ações: Editar e Excluir */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
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
