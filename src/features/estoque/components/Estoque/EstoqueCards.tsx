'use client';

import { Pencil, Trash2, Building2, ArrowUpDown, Printer, User, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueCardsProps {
  items: Insumo[];
  onEdit: (insumo: Insumo) => void;
  onDelete: (insumo: Insumo) => void;
  onQuickAdjust?: (insumo: Insumo) => void;
  onViewSupplier?: (insumo: Insumo) => void;
  onPrintEtiqueta?: (insumo: Insumo) => void;
}

export function EstoqueCards({
  items,
  onEdit,
  onDelete,
  onQuickAdjust,
  onViewSupplier,
  onPrintEtiqueta,
}: EstoqueCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const baixo = isEstoqueBaixo(item);
        const total = valorTotalInsumo(item);
        const percentualMin = item.min > 0 ? Math.round((item.qtd / item.min) * 100) : 100;
        const barWidth = Math.min(percentualMin, 100);
        const barColor = baixo ? 'bg-red-500' : percentualMin < 130 ? 'bg-amber-500' : 'bg-emerald-500';

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

              {/* Barra de Progresso / Nível */}
              <div className="space-y-1 py-1">
                <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                  <span>Nível vs Mínimo ({item.min} {item.unidade})</span>
                  <span className="font-bold font-mono">{percentualMin}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-slate-500 font-medium">Preço por Quilo:</dt>
                <dd className="font-mono text-slate-700">{formatCurrency(item.custoUnitario)}/{item.unidade}</dd>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                <dt className="font-bold text-slate-900">Valor Total:</dt>
                <dd className="font-black text-red-600 font-mono">
                  {formatCurrency(total)}
                </dd>
              </div>

              {item.fornecedor && (
                <div className="flex items-center justify-between pt-1.5 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Fornecedor:
                  </span>
                  <button
                    type="button"
                    onClick={() => (onViewSupplier ? onViewSupplier(item) : onEdit(item))}
                    className="font-semibold text-slate-700 hover:text-indigo-600 hover:underline truncate max-w-[150px] cursor-pointer"
                  >
                    {item.fornecedor}
                  </button>
                </div>
              )}
            </dl>

            {/* Bloco de Auditoria */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span className="font-medium text-slate-700">{item.atualizadoPor || item.criadoPor || 'Arthur'}</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-2.5 h-2.5 text-slate-400" />
                <span>{formatDateTime(item.updatedAt || item.createdAt)}</span>
              </span>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between gap-1.5 pt-3 border-t border-slate-100">
              {/* Botão de Movimentação Rápida */}
              {onQuickAdjust && (
                <button
                  type="button"
                  onClick={() => onQuickAdjust(item)}
                  title={`Movimentar estoque de ${item.nome}`}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Ajustar</span>
                </button>
              )}

              {/* Botão Imprimir Etiqueta Térmica */}
              {onPrintEtiqueta && (
                <button
                  type="button"
                  onClick={() => onPrintEtiqueta(item)}
                  title={`Imprimir etiqueta térmica de ${item.nome}`}
                  aria-label={`Imprimir etiqueta de ${item.nome}`}
                  className="w-9 h-9 rounded-xl border border-sky-200/80 bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}

              {/* Botão Fornecedor / Detalhes */}
              {item.fornecedor && (
                <button
                  type="button"
                  onClick={() => (onViewSupplier ? onViewSupplier(item) : onEdit(item))}
                  title={`Fornecedor: ${item.fornecedor}`}
                  aria-label={`Ver fornecedor de ${item.nome}`}
                  className="w-9 h-9 rounded-xl border border-indigo-200/80 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                >
                  <Building2 className="w-4 h-4" />
                </button>
              )}

              {/* Botão Editar */}
              <button
                type="button"
                onClick={() => onEdit(item)}
                title={`Editar ${item.nome}`}
                aria-label={`Editar ${item.nome}`}
                className="w-9 h-9 rounded-xl border border-amber-200/80 bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Botão Excluir */}
              <button
                type="button"
                onClick={() => onDelete(item)}
                title={`Excluir ${item.nome}`}
                aria-label={`Excluir ${item.nome}`}
                className="w-9 h-9 rounded-xl border border-red-200/80 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
