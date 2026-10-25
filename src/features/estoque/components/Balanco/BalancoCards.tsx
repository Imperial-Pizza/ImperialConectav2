'use client';

import {
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Tag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { ItemBalanco } from '../../types';

interface BalancoCardsProps {
  items: ItemBalanco[];
  onSetContagem: (id: number, val: number | null) => void;
  onAjustarContagem: (id: number, delta: number) => void;
  onMarcarBateu: (id: number) => void;
  onSetMotivo: (id: number, motivo: string) => void;
}

const MOTIVOS_CHIPS = [
  { id: 'Desperdício / Vencido', label: 'Desperdício', emoji: '🗑️' },
  { id: 'Quebra operacional / Avaria', label: 'Quebra', emoji: '💔' },
  { id: 'Consumo não registrado na cozinha', label: 'Consumo', emoji: '🍳' },
  { id: 'Diferença de pesagem / rendimento', label: 'Peso', emoji: '⚖️' },
];

export function BalancoCards({
  items,
  onSetContagem,
  onAjustarContagem,
  onMarcarBateu,
  onSetMotivo,
}: BalancoCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const temContagem = item.qtdFisica !== null;
        const isDivergente = item.status === 'falta' || item.status === 'sobra';

        return (
          <article
            key={item.insumoId}
            className={`bg-white border rounded-3xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between group ${
              item.status === 'falta'
                ? 'border-red-200/90'
                : item.status === 'sobra'
                ? 'border-amber-200/90'
                : item.status === 'bateu'
                ? 'border-emerald-200/90'
                : 'border-slate-200/90'
            }`}
          >
            <div className="space-y-3">
              {/* Badges superiores: Código + Categoria + Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    {item.codigo}
                  </span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {item.categoria}
                  </span>
                </div>

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
                  {item.status === 'falta'
                    ? 'Falta'
                    : item.status === 'sobra'
                    ? 'Sobra'
                    : item.status === 'bateu'
                    ? 'Bateu'
                    : 'Pendente'}
                </span>
              </div>

              {/* Nome do Produto */}
              <div>
                <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-red-600 transition-colors">
                  {item.nome}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Preço por Quilo: {formatCurrency(item.custoUnitario)}/{item.unidade}
                </p>
              </div>

              {/* Comparativo de Saldos */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sistema</span>
                  <p className="font-black text-slate-900 font-mono mt-0.5">
                    {item.qtdSistema} {item.unidade}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Físico (Real)</span>
                  <p
                    className={`font-black font-mono mt-0.5 ${
                      temContagem ? 'text-slate-900' : 'text-slate-400 italic font-sans'
                    }`}
                  >
                    {temContagem ? `${item.qtdFisica} ${item.unidade}` : 'Pendente'}
                  </p>
                </div>
              </div>

              {/* Variação em R$ */}
              {temContagem && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    item.status === 'bateu'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      : item.status === 'falta'
                      ? 'bg-red-50 text-red-800 border border-red-200/80'
                      : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  }`}
                >
                  <span className="flex items-center gap-1 text-[11px]">
                    {item.status === 'bateu' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : item.status === 'falta' ? (
                      <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {item.status === 'bateu'
                      ? 'Sem divergência'
                      : item.status === 'falta'
                      ? 'Prejuízo / Quebra'
                      : 'Excedente'}
                  </span>
                  <span className="font-mono font-black text-xs">
                    {item.status === 'bateu'
                      ? 'R$ 0,00'
                      : item.status === 'falta'
                      ? `- ${formatCurrency(Math.abs(item.divergenciaValor))}`
                      : `+ ${formatCurrency(item.divergenciaValor)}`}
                  </span>
                </div>
              )}

              {/* Chips de Motivo */}
              {isDivergente && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Motivo:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
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
                </div>
              )}
            </div>

            {/* Controles de Contagem no Rodapé do Card */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, -1)}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Subtrair 1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="relative flex-1">
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
                    className="w-full text-center py-1.5 px-2 font-mono font-black text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onAjustarContagem(item.insumoId, 1)}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  title="Adicionar 1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onMarcarBateu(item.insumoId)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0 ${
                    item.status === 'bateu'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  title="Marcar que bateu com o sistema"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Bateu</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
