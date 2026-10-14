'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { isEstoqueBaixo, valorTotalInsumo } from '../../services/estoqueService';
import { formatCurrency } from '../../utils/format';
import type { Insumo } from '../../types';

interface EstoqueTableProps {
  items: Insumo[];
  onEdit: (insumo: Insumo) => void;
  onDelete: (insumo: Insumo) => void;
}

export function EstoqueTable({ items, onEdit, onDelete }: EstoqueTableProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="py-3.5 px-4">Código</th>
              <th scope="col" className="py-3.5 px-4">Categoria</th>
              <th scope="col" className="py-3.5 px-4">Produto</th>
              <th scope="col" className="py-3.5 px-4">Unidade</th>
              <th scope="col" className="py-3.5 px-4">Qtd. Atual</th>
              <th scope="col" className="py-3.5 px-4">Estoque Mínimo</th>
              <th scope="col" className="py-3.5 px-4">Preço Médio</th>
              <th scope="col" className="py-3.5 px-4">Valor Total</th>
              <th scope="col" className="py-3.5 px-4">Fornecedor Principal</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const baixo = isEstoqueBaixo(item);
              const total = valorTotalInsumo(item);

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Código */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-800 border border-slate-200">
                      {item.codigo || `INS-${item.id}`}
                    </span>
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold text-[10px] border border-slate-200/60">
                      {item.categoria}
                    </span>
                  </td>

                  {/* Produto */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate" title={item.nome}>
                    <div>{item.nome}</div>
                    {item.observacoes && (
                      <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]" title={item.observacoes}>
                        {item.observacoes}
                      </div>
                    )}
                  </td>

                  {/* Unidade */}
                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    {item.unidade}
                  </td>

                  {/* Qtd. Atual */}
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-800">
                    {item.qtd} {item.unidade}
                  </td>

                  {/* Estoque Mínimo */}
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {item.min} {item.unidade}
                  </td>

                  {/* Preço Médio (Custo Unitário) */}
                  <td className="py-3.5 px-4 text-slate-700 font-mono">
                    {formatCurrency(item.custoUnitario)}
                  </td>

                  {/* Valor Total */}
                  <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                    {formatCurrency(total)}
                  </td>

                  {/* Fornecedor Principal */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium max-w-[180px] truncate" title={item.fornecedor}>
                    {item.fornecedor || '—'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge isBaixo={baixo} />
                  </td>

                  {/* Ações (Editar e Excluir) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title={`Editar ${item.nome}`}
                        aria-label={`Editar ${item.nome}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title={`Excluir ${item.nome}`}
                        aria-label={`Excluir ${item.nome}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
