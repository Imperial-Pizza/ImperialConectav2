'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { ItemBalanco } from '../../types';

interface BalancoTableProps {
  items: ItemBalanco[];
  onSetContagem: (id: number, val: number | null) => void;
  onAjustarContagem: (id: number, delta: number) => void;
  onMarcarBateu: (id: number) => void;
  onSetMotivo: (id: number, motivo: string) => void;
}

const MOTIVOS_CHIPS = [
  { id: 'Desperdício / Vencido', label: 'Desperdício / Vencido', emoji: '🗑️' },
  { id: 'Quebra operacional / Avaria', label: 'Quebra / Avaria', emoji: '💔' },
  { id: 'Consumo não registrado na cozinha', label: 'Consumo Cozinha', emoji: '🍳' },
  { id: 'Diferença de pesagem / rendimento', label: 'Diferença de Peso', emoji: '⚖️' },
  { id: 'Ajuste geral de inventário', label: 'Ajuste Geral', emoji: '📝' },
];

export function BalancoTable({
  items,
  onSetContagem,
  onAjustarContagem,
  onMarcarBateu,
  onSetMotivo,
}: BalancoTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const temContagem = item.qtdFisica !== null;
        const isDivergente = item.status === 'falta' || item.status === 'sobra';
        const numeroCodigo =
          String(item.codigo || item.insumoId).replace(/\D/g, '').slice(-3) ||
          String(item.insumoId).padStart(3, '0');

        return (
          <div
            key={item.insumoId}
            className={`bg-white border rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4 group ${
              item.status === 'falta'
                ? 'border-red-200/90 hover:border-red-300 hover:shadow-md'
                : item.status === 'sobra'
                ? 'border-amber-200/90 hover:border-amber-300 hover:shadow-md'
                : item.status === 'bateu'
                ? 'border-emerald-200/90 hover:border-emerald-300 hover:shadow-md'
                : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {/* Lado Esquerdo: Box de Código/Status + Informações do Insumo */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box no Estilo Imperial */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                    item.status === 'falta'
                      ? 'bg-red-50/80 border-red-200/80 text-red-600'
                      : item.status === 'sobra'
                      ? 'bg-amber-50/80 border-amber-200/80 text-amber-700'
                      : item.status === 'bateu'
                      ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-700'
                      : 'bg-blue-50/80 border-blue-200/70 text-blue-700'
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    CÓD
                  </span>
                  <span className="text-base font-black font-mono leading-none">
                    {numeroCodigo}
                  </span>
                </div>

                {/* Status Pill embaixo */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 shrink-0 ${
                    item.status === 'falta'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : item.status === 'sobra'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : item.status === 'bateu'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {item.status === 'falta' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Falta
                    </>
                  ) : item.status === 'sobra' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Sobra
                    </>
                  ) : item.status === 'bateu' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Bateu
                    </>
                  ) : (
                    'Pendente'
                  )}
                </span>
              </div>

              {/* Informações Centrais do Produto */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Linha 1: Nome + Categoria + Código */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {item.nome}
                  </h3>

                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1 shrink-0">
                    <Tag className="w-3 h-3 text-amber-600" />
                    {item.categoria}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                    {item.codigo}
                  </span>
                </div>

                {/* Linha 2: Métricas de Sistema */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  <span>
                    Sistema:{' '}
                    <strong className="text-slate-900 font-black font-mono">
                      {item.qtdSistema} {item.unidade}
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Preço por Quilo:{' '}
                    <strong className="text-slate-700 font-mono font-semibold">
                      {formatCurrency(item.custoUnitario)}/{item.unidade}
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Total:{' '}
                    <strong className="text-slate-700 font-mono font-semibold">
                      {formatCurrency(item.qtdSistema * item.custoUnitario)}
                    </strong>
                  </span>
                </div>

                {/* Linha 3: Chips Rápidos de Justificativa quando houver divergência */}
                {isDivergente && (
                  <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mr-1">
                      Justificativa:
                    </span>
                    {MOTIVOS_CHIPS.map((chip) => {
                      const isSelected = item.motivo === chip.id;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => onSetMotivo(item.insumoId, isSelected ? '' : chip.id)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{chip.emoji}</span>
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito: Controlador Interativo de Contagem Física & Variação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
              {/* Divergência Apurada Card */}
              <div className="min-w-[130px] text-left sm:text-right">
                {!temContagem ? (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Divergência</span>
                    <p className="text-xs font-semibold text-slate-400 italic">Aguardando contagem</p>
                  </div>
                ) : item.status === 'bateu' ? (
                  <div className="text-left sm:text-right space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-emerald-600 flex items-center sm:justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Exato
                    </span>
                    <p className="text-xs font-black font-mono text-emerald-700">0 {item.unidade}</p>
                    <p className="text-[10px] text-slate-400">R$ 0,00</p>
                  </div>
                ) : item.status === 'falta' ? (
                  <div className="text-left sm:text-right space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-red-600 flex items-center sm:justify-end gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Falta (Quebra)
                    </span>
                    <p className="text-xs font-black font-mono text-red-600">
                      {item.divergenciaQtd} {item.unidade}
                    </p>
                    <p className="text-[11px] font-bold font-mono text-red-600">
                      - {formatCurrency(Math.abs(item.divergenciaValor))}
                    </p>
                  </div>
                ) : (
                  <div className="text-left sm:text-right space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-600 flex items-center sm:justify-end gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Sobra no Estoque
                    </span>
                    <p className="text-xs font-black font-mono text-amber-700">
                      +{item.divergenciaQtd} {item.unidade}
                    </p>
                    <p className="text-[11px] font-bold font-mono text-amber-700">
                      + {formatCurrency(item.divergenciaValor)}
                    </p>
                  </div>
                )}
              </div>

              {/* Controles de Contagem Física Táteis */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
                {/* Botão -5 */}
                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, -5)}
                  className="px-2 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-black font-mono transition-all cursor-pointer active:scale-95"
                  title="Subtrair 5"
                >
                  -5
                </button>

                {/* Botão -1 */}
                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, -1)}
                  className="w-8 h-8 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Subtrair 1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Input Numérico Central */}
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.qtdFisica !== null ? item.qtdFisica : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onSetContagem(item.insumoId, val);
                    }}
                    placeholder="Real"
                    className={`w-20 text-center py-1.5 px-1 font-mono font-black text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      item.status === 'bateu'
                        ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950 focus:ring-emerald-500'
                        : item.status === 'falta'
                        ? 'border-red-300 bg-red-50/60 text-red-950 focus:ring-red-500'
                        : item.status === 'sobra'
                        ? 'border-amber-300 bg-amber-50/60 text-amber-950 focus:ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:ring-red-500'
                    }`}
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 pointer-events-none">
                    {item.unidade}
                  </span>
                </div>

                {/* Botão +1 */}
                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, 1)}
                  className="w-8 h-8 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Adicionar 1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* Botão +5 */}
                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, 5)}
                  className="px-2 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-black font-mono transition-all cursor-pointer active:scale-95"
                  title="Adicionar 5"
                >
                  +5
                </button>

                {/* Botão Rápido Bateu (Igual ao Sistema) */}
                <button
                  type="button"
                  onClick={() => onMarcarBateu(item.insumoId)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    item.status === 'bateu'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                  }`}
                  title={`Definir contagem como exatamente ${item.qtdSistema} ${item.unidade}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Bateu</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
