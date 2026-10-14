import { StatusBadge } from './StatusBadge';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueTableProps {
  items: Insumo[];
}

export function EstoqueTable({ items }: EstoqueTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th scope="col" className="p-3.5">Insumo</th>
              <th scope="col" className="p-3.5">Categoria</th>
              <th scope="col" className="p-3.5">Quantidade Atual</th>
              <th scope="col" className="p-3.5">Custo Unitário</th>
              <th scope="col" className="p-3.5">Valor Total</th>
              <th scope="col" className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">{item.nome}</td>
                <td className="p-3.5">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    {item.categoria}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-slate-800">
                  {item.qtd} {item.unidade}
                </td>
                <td className="p-3.5 text-slate-600 font-mono">
                  {formatCurrency(item.custoUnitario)}
                </td>
                <td className="p-3.5 font-bold text-slate-900 font-mono">
                  {formatCurrency(valorTotalInsumo(item))}
                </td>
                <td className="p-3.5">
                  <StatusBadge isBaixo={isEstoqueBaixo(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
