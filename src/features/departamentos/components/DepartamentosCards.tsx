'use client';

import {
  Building2,
  Eye,
  Hash,
  Mail,
  UserCheck,
  Users,
} from 'lucide-react';
import type { Departamento } from '../types';

interface DepartamentosCardsProps {
  items: Departamento[];
  onViewDetail: (dep: Departamento) => void;
}

export function DepartamentosCards({ items, onViewDetail }: DepartamentosCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const initials = item.nome
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <article
            key={item.id}
            onClick={() => onViewDetail(item)}
            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
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
                  <UserCheck className="w-3.5 h-3.5 text-red-500" />
                  Gestor:
                </dt>
                <dd className="font-bold text-slate-800 truncate">{item.gestor || 'Não definido'}</dd>
              </div>

              <div className="flex justify-between items-center gap-2">
                <dt className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                  <Hash className="w-3.5 h-3.5 text-amber-500" />
                  Centro de Custo:
                </dt>
                <dd className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-[11px]">
                  {item.centroCusto || 'N/A'}
                </dd>
              </div>

              {item.email && (
                <div className="flex justify-between items-center gap-2">
                  <dt className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    E-mail:
                  </dt>
                  <dd className="font-medium text-blue-600 truncate max-w-[170px]" title={item.email}>
                    {item.email}
                  </dd>
                </div>
              )}
            </dl>

            {/* Rodapé de Ação */}
            <div
              className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onViewDetail(item)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-red-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Equipe ({item.colaboradoresCount})</span>
              </button>

              {item.email && (
                <a
                  href={`mailto:${item.email}`}
                  title={`Enviar e-mail para ${item.email}`}
                  className="w-9 h-9 rounded-xl border border-blue-200/80 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

