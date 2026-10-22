'use client';

import {
  ArrowUpDown,
  Boxes,
  Calendar,
  Pencil,
  Printer,
  Scale,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import { isLoteBaixo } from '../../services/produtosPesadosService';
import { formatCurrency } from '../../utils/format';
import type { ProdutoPesado } from '../../types';

interface ProdutosPesadosCardsProps {
  items: ProdutoPesado[];
  onEdit: (item: ProdutoPesado) => void;
  onDelete: (item: ProdutoPesado) => void;
  onQuickAdjust: (item: ProdutoPesado) => void;
  onPrintEtiqueta: (item: ProdutoPesado) => void;
}

export function ProdutosPesadosCards({
  items,
  onEdit,
  onDelete,
  onQuickAdjust,
  onPrintEtiqueta,
}: ProdutosPesadosCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const baixo = isLoteBaixo(item);
        const totalValor = item.pesoTotalKg * item.custoPorKg;
        const percentualMin =
          item.pesoMinimoKg > 0
            ? Math.round((item.pesoTotalKg / item.pesoMinimoKg) * 100)
            : 100;
        const barWidth = Math.min(percentualMin, 100);
        const barColor = baixo
          ? 'bg-red-500'
          : percentualMin < 130
          ? 'bg-amber-500'
          : 'bg-emerald-500';

        return (
          <article
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Badges superiores */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {item.codigo}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px] border border-slate-200/60">
                    {item.categoria}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                    baixo
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {baixo ? 'Repor' : 'Ok'}
                </span>
              </div>

              {/* Nome do Produto */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                  {item.nome}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1" title={item.insumoOrigem}>
                  Origem: {item.insumoOrigem}
                </p>
              </div>

              {/* Destaque de Peso e Pacotes */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Disponível
                  </span>
                  <p className="text-lg font-black font-mono text-slate-900 leading-tight">
                    {item.pesoTotalKg}{' '}
                    <span className="text-xs font-bold text-emerald-600">kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Pacotes
                  </span>
                  <p className="text-sm font-bold text-slate-700">
                    {item.quantidadePacotes}x {item.pesoUnitarioKg}kg
                  </p>
                </div>
              </div>

              {/* Detalhes de Lote, Validade e Custo */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px]">Lote / Validade:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">
                    {item.lote} • {item.dataValidade}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px]">Custo / Valor Total:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">
                    {formatCurrency(item.custoPorKg)}/kg • {formatCurrency(totalValor)}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso Mínimo */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Mín: {item.pesoMinimoKg} kg</span>
                  <span>{percentualMin}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ações inferiores */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onQuickAdjust(item)}
                  title="Ajuste rápido de pacotes"
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Ajustar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPrintEtiqueta(item)}
                  title="Imprimir etiqueta de balança"
                  className="p-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  title="Editar produto pesado"
                  className="p-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  title="Excluir"
                  className="p-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
