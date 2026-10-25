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
  Thermometer,
  Trash2,
} from 'lucide-react';
import { isLoteBaixo } from '../../services/produtosPesadosService';
import { formatCurrency } from '../../utils/format';
import type { ProdutoPesado } from '../../types';

interface ProdutosPesadosTableProps {
  items: ProdutoPesado[];
  onEdit: (item: ProdutoPesado) => void;
  onDelete: (item: ProdutoPesado) => void;
  onQuickAdjust: (item: ProdutoPesado) => void;
  onPrintEtiqueta: (item: ProdutoPesado) => void;
}

export function ProdutosPesadosTable({
  items,
  onEdit,
  onDelete,
  onQuickAdjust,
  onPrintEtiqueta,
}: ProdutosPesadosTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const baixo = isLoteBaixo(item);
        const totalValor = item.pesoTotalKg * item.custoPorKg;
        const numeroCodigo =
          String(item.codigo || item.id).replace(/\D/g, '').slice(-3) ||
          String(item.id).padStart(3, '0');

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
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Lado Esquerdo: Box de Código/Status + Informações Principais */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box estilo Balança */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                    PES
                  </span>
                  <span className="text-base font-black font-mono text-emerald-700 leading-none">
                    {numeroCodigo}
                  </span>
                </div>

                {/* Status Pill */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                    baixo
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {baixo ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Baixo
                    </>
                  ) : (
                    'Normal'
                  )}
                </span>
              </div>

              {/* Informações Centrais do Produto Pesado */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Linha 1: Nome + Categoria + Lote */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.nome}
                  </h3>

                  {/* Badge da Categoria */}
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3 text-amber-600" />
                    {item.categoria}
                  </span>

                  {/* Código do Lote */}
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                    {item.lote}
                  </span>

                  {/* Tag de Peso por Porção */}
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    {item.pesoUnitarioKg} kg / pacote
                  </span>
                </div>

                {/* Linha 2: Métricas de Quantidade e Valores */}
                <div className="flex items-center gap-3 text-xs flex-wrap font-medium text-slate-500">
                  <div className="flex items-center gap-1 text-slate-900 font-bold">
                    <Boxes className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {item.quantidadePacotes} {item.quantidadePacotes === 1 ? 'pct' : 'pcts'} (
                      <span className="text-emerald-600">{item.pesoTotalKg} kg</span>)
                    </span>
                  </div>

                  <span className="text-slate-300">•</span>
                  <span>Mínimo: <b className="text-slate-700">{item.pesoMinimoKg} kg</b></span>

                  <span className="text-slate-300">•</span>
                  <span>
                    Preço por Quilo:{' '}
                    <b className="text-slate-700 font-mono">{formatCurrency(item.custoPorKg)}/kg</b>
                  </span>

                  <span className="text-slate-300">•</span>
                  <span>
                    Total: <b className="text-emerald-700 font-mono">{formatCurrency(totalValor)}</b>
                  </span>

                  {item.rendimentoPercentual && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        {item.rendimentoPercentual}% rend.
                      </span>
                    </>
                  )}
                </div>

                {/* Linha 3: Insumo Origem, Validade e Armazenamento */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                  <span className="text-slate-600">
                    Origem: <strong className="text-slate-800">{item.insumoOrigem}</strong>
                  </span>

                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Validade: <strong>{item.dataValidade}</strong>
                  </span>

                  {item.temperatura && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Thermometer className="w-3 h-3" />
                        {item.temperatura}
                      </span>
                    </>
                  )}
                </div>

                {/* Linha 4: Barra de Progresso do Estoque Mínimo */}
                <div className="pt-1.5 flex items-center gap-3 max-w-md">
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400 shrink-0">
                    {percentualMin}% da meta mín.
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Ações Rápidas */}
            <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
              {/* Botão de Ajuste Rápido de Pacotes (+ / -) */}
              <button
                type="button"
                onClick={() => onQuickAdjust(item)}
                title="Ajuste rápido de pacotes e pesagem"
                className="w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              {/* Botão de Imprimir Etiqueta Térmica */}
              <button
                type="button"
                onClick={() => onPrintEtiqueta(item)}
                title="Imprimir etiqueta para impressora térmica de balança"
                className="w-9 h-9 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Botão de Edição */}
              <button
                type="button"
                onClick={() => onEdit(item)}
                title="Editar dados da pesagem"
                className="w-9 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Botão de Exclusão */}
              <button
                type="button"
                onClick={() => onDelete(item)}
                title="Excluir lote"
                className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer"
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
