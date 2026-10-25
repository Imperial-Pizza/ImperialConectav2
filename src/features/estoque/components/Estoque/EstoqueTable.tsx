'use client';

import { Building2, Pencil, Trash2, Tag, ArrowUpDown, Printer, User, Calendar, Clock } from 'lucide-react';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueTableProps {
  items: Insumo[];
  onEdit: (insumo: Insumo) => void;
  onDelete: (insumo: Insumo) => void;
  onQuickAdjust?: (insumo: Insumo) => void;
  onViewSupplier?: (insumo: Insumo) => void;
  onPrintEtiqueta?: (insumo: Insumo) => void;
}

export function EstoqueTable({
  items,
  onEdit,
  onDelete,
  onQuickAdjust,
  onViewSupplier,
  onPrintEtiqueta,
}: EstoqueTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const baixo = isEstoqueBaixo(item);
        const total = valorTotalInsumo(item);
        const numeroCodigo =
          String(item.codigo || item.id).replace(/\D/g, '').slice(-3) ||
          String(item.id).padStart(3, '0');

        const percentualMin = item.min > 0 ? Math.round((item.qtd / item.min) * 100) : 100;
        const barWidth = Math.min(percentualMin, 100);
        const barColor = baixo ? 'bg-red-500' : percentualMin < 130 ? 'bg-amber-500' : 'bg-emerald-500';

        return (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Lado Esquerdo: Box de Código/Status + Informações do Insumo */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box estilo CMD da comanda */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-200/70 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-500">
                    CÓD
                  </span>
                  <span className="text-base font-black font-mono text-blue-700 leading-none">
                    {numeroCodigo}
                  </span>
                </div>

                {/* Status Pill embaixo */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                    baixo
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
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

              {/* Informações Centrais do Produto */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Linha 1: Nome do Produto + Tag de Categoria + Código completo */}
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
                    {item.codigo}
                  </span>
                </div>

                {/* Linha 2: Métricas de Estoque, Preço e Valores */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  <span className="text-slate-900 font-black font-mono">
                    {item.qtd} {item.unidade}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Mínimo: <strong className="text-slate-700 font-mono font-semibold">{item.min} {item.unidade}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Preço por Quilo:{' '}
                    <strong className="text-slate-700 font-mono font-semibold">
                      {formatCurrency(item.custoUnitario)}/{item.unidade}
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-slate-700">
                    Total:{' '}
                    <strong className="text-emerald-700 font-mono font-black">
                      {formatCurrency(total)}
                    </strong>
                  </span>

                  {item.fornecedor && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{item.fornecedor}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Linha 3: Barra Visual de Nível de Estoque */}
                <div className="flex items-center gap-2 pt-0.5 max-w-sm">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    {percentualMin}% da meta mín.
                  </span>
                </div>

                {/* Linha 4: Observações (se houver) */}
                {item.observacoes && (
                  <p className="text-[11px] text-slate-400 font-normal italic truncate" title={item.observacoes}>
                    Obs: {item.observacoes}
                  </p>
                )}
              </div>
            </div>

            {/* Coluna Central-Direita: Auditoria (Usuário Logado + Data/Horário) */}
            <div className="flex flex-col justify-center gap-1.5 py-2 px-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-[11px] shrink-0 w-full sm:w-auto min-w-[210px] shadow-2xs">
              {/* Criado por */}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <User className="w-3 h-3 text-slate-400" />
                  Criado por:
                </span>
                <span className="font-bold text-slate-800 text-[11px] truncate max-w-[110px]" title={item.criadoPor || 'Arthur'}>
                  {item.criadoPor || 'Arthur'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  Criação:
                </span>
                <span>{formatDateTime(item.createdAt)}</span>
              </div>

              <div className="border-t border-slate-200/70 my-0.5" />

              {/* Atualizado por */}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  Alterado por:
                </span>
                <span className="font-bold text-indigo-700 text-[11px] truncate max-w-[110px]" title={item.atualizadoPor || 'Arthur'}>
                  {item.atualizadoPor || 'Arthur'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  Edição:
                </span>
                <span>{formatDateTime(item.updatedAt)}</span>
              </div>
            </div>

            {/* Lado Direito: Botões de Ação */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
              {/* Botão de Movimentação Rápida (+ / -) */}
              {onQuickAdjust && (
                <button
                  type="button"
                  onClick={() => onQuickAdjust(item)}
                  title={`Movimentar estoque (+ entrada / - saída) de ${item.nome}`}
                  aria-label={`Movimentar estoque de ${item.nome}`}
                  className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              )}

              {/* Botão Detalhes / Fornecedor (Roxo/Azul estilo ícone da imagem) */}
              <button
                type="button"
                onClick={() => (onViewSupplier ? onViewSupplier(item) : onEdit(item))}
                title={`Fornecedor: ${item.fornecedor || 'Padrão'} (Ver contato e reposição)`}
                aria-label={`Ver fornecedor de ${item.nome}`}
                className="w-10 h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Building2 className="w-4 h-4" />
              </button>

              {/* Botão Imprimir Etiqueta Térmica */}
              {onPrintEtiqueta && (
                <button
                  type="button"
                  onClick={() => onPrintEtiqueta(item)}
                  title={`Imprimir etiqueta térmica de ${item.nome}`}
                  aria-label={`Imprimir etiqueta de ${item.nome}`}
                  className="w-10 h-10 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}

              {/* Botão Editar (Âmbar/Laranja com ícone de lápis) */}
              <button
                type="button"
                onClick={() => onEdit(item)}
                title={`Editar ${item.nome}`}
                aria-label={`Editar ${item.nome}`}
                className="w-10 h-10 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Botão Excluir (Vermelho suave com ícone de alerta/lixeira) */}
              <button
                type="button"
                onClick={() => onDelete(item)}
                title={`Excluir ${item.nome}`}
                aria-label={`Excluir ${item.nome}`}
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
