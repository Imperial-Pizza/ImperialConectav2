'use client';

import {
  Building2,
  Clock,
  Eye,
  Hash,
  Users,
} from 'lucide-react';
import type { Departamento } from '../types';

interface DepartamentosCardsProps {
  items: Departamento[];
  onViewDetail: (dep: Departamento) => void;
}

export function DepartamentosCards({ items, onViewDetail }: DepartamentosCardsProps) {
  // Ativos primeiro (Administrativo, Estoque), e os que estão em desenvolvimento embaixo
  const sortedItems = [...items].sort((a, b) => {
    const aEmBreve =
      ['ATD-01', 'COZ-01'].includes(a.codigo) ||
      ['atendimento', 'cozinha'].includes(a.nome.toLowerCase());
    const bEmBreve =
      ['ATD-01', 'COZ-01'].includes(b.codigo) ||
      ['atendimento', 'cozinha'].includes(b.nome.toLowerCase());
    if (aEmBreve === bEmBreve) return 0;
    return aEmBreve ? 1 : -1;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedItems.map((item) => {
        const initials = item.nome
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        const isEmBreve =
          ['ATD-01', 'COZ-01'].includes(item.codigo) ||
          ['atendimento', 'cozinha'].includes(item.nome.toLowerCase());

        return (
          <article
            key={item.id}
            onClick={() => {
              if (!isEmBreve) onViewDetail(item);
            }}
            className={`relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
              isEmBreve
                ? 'cursor-not-allowed select-none'
                : 'hover:border-slate-300 hover:shadow-md cursor-pointer'
            }`}
          >
            {/* Overlay em Breve (Descentralizado) */}
            {isEmBreve && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2.5px] rounded-3xl flex flex-col items-start justify-center p-5 text-left cursor-not-allowed select-none"
              >
                <div className="bg-white/95 border border-slate-200/90 shadow-sm rounded-2xl p-4 flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200/60 inline-block mb-1">
                      Funcionalidade em Breve
                    </span>
                    <p className="text-xs font-bold text-slate-700 leading-snug">
                      Esta área está sendo aprimorada e estará disponível nas próximas atualizações.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`space-y-4 flex-1 flex flex-col justify-between ${
                isEmBreve ? 'filter blur-[1.5px] opacity-40 pointer-events-none' : ''
              }`}
            >
            <div className="space-y-3">
              {/* Topo: Avatar + Nome + Código */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
                    {initials || <Building2 className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-red-600 transition-colors truncate">
                      {item.nome}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      Código: {item.codigo}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {item.colaboradoresCount}
                </span>
              </div>

              {item.descricao && (
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed" title={item.descricao}>
                  {item.descricao}
                </p>
              )}
            </div>

            {/* Detalhes do Departamento */}
            <dl className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center gap-2">
                <dt className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <Hash className="w-3.5 h-3.5 text-amber-500" />
                  Centro de Custo:
                </dt>
                <dd className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-[11px]">
                  {item.centroCusto || 'N/A'}
                </dd>
              </div>
            </dl>

            {/* Rodapé de Ação */}
            <div
              className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onViewDetail(item)}
                title={`Ver equipe e detalhes de ${item.nome}`}
                aria-label={`Ver detalhes de ${item.nome}`}
                className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all shadow-sm shadow-red-600/20 active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      );
    })}
    </div>
  );
}

