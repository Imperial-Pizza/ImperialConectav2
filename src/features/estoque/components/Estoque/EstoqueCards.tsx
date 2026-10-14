import { StatusBadge } from './StatusBadge';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueCardsProps {
  items: Insumo[];
}

export function EstoqueCards({ items }: EstoqueCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                {item.categoria}
              </span>
              <StatusBadge isBaixo={isEstoqueBaixo(item)} compact />
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.nome}</h3>
          </div>

          <dl className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Quantidade:</dt>
              <dd className="font-bold text-slate-800">
                {item.qtd} {item.unidade}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Custo Unitário:</dt>
              <dd className="font-mono text-slate-700">{formatCurrency(item.custoUnitario)}</dd>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-50">
              <dt className="font-bold text-slate-900">Total em Estoque:</dt>
              <dd className="font-black text-red-600 font-mono">
                {formatCurrency(valorTotalInsumo(item))}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
