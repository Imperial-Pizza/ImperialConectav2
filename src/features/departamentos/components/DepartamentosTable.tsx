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

interface DepartamentosTableProps {
  items: Departamento[];
  onViewDetail: (dep: Departamento) => void;
}

export function DepartamentosTable({ items, onViewDetail }: DepartamentosTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const codigoCurto = (item.codigo || 'DEP').slice(0, 6);

        return (
          <div
            key={item.id}
            onClick={() => onViewDetail(item)}
            className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group cursor-pointer"
          >
            {/* Lado Esquerdo: Box de Código + Informações do Departamento */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box estilo CMD */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform px-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
                    SETOR
                  </span>
                  <span className="text-xs font-black font-mono text-indigo-700 leading-none truncate max-w-full">
                    {codigoCurto}
                  </span>
                </div>

                {/* Pill de colaboradores embaixo */}
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item.colaboradoresCount} {item.colaboradoresCount === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>

              {/* Informações Centrais */}
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Linha 1: Nome do Departamento + Centro de Custo + Código */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {item.nome}
                  </h3>

                  {item.centroCusto && (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1 shrink-0">
                      <Hash className="w-3 h-3 text-amber-600" />
                      CC: {item.centroCusto}
                    </span>
                  )}

                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                    {item.codigo}
                  </span>
                </div>

                {/* Linha 2: Gestor, E-mail e Equipe */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    Gestor: <strong className="text-slate-900">{item.gestor || 'Não definido'}</strong>
                  </span>

                  {item.email && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[220px]">{item.email}</span>
                      </span>
                    </>
                  )}

                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong className="text-slate-800 font-mono">{item.colaboradoresCount}</strong>{' '}
                    {item.colaboradoresCount === 1 ? 'colaborador vinculado' : 'colaboradores vinculados'}
                  </span>
                </div>

                {/* Linha 3: Descrição (se houver) */}
                {item.descricao && (
                  <p className="text-[11px] text-slate-400 font-normal truncate" title={item.descricao}>
                    {item.descricao}
                  </p>
                )}
              </div>
            </div>

            {/* Lado Direito: Botões de Ação */}
            <div
              className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              {item.email && (
                <a
                  href={`mailto:${item.email}`}
                  title={`Enviar e-mail para ${item.email}`}
                  aria-label={`Enviar e-mail para ${item.nome}`}
                  className="w-10 h-10 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => onViewDetail(item)}
                title={`Ver equipe e detalhes de ${item.nome}`}
                aria-label={`Ver detalhes de ${item.nome}`}
                className="px-3.5 h-10 rounded-2xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Equipe</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

