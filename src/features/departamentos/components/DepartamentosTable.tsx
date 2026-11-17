'use client';

import {
  Building2,
  Clock,
  Eye,
  Hash,
  Users,
} from 'lucide-react';
import type { Departamento } from '../types';

interface DepartamentosTableProps {
  items: Departamento[];
  onViewDetail: (dep: Departamento) => void;
}

export function DepartamentosTable({ items, onViewDetail }: DepartamentosTableProps) {
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
    <div className="space-y-3">
      {sortedItems.map((item) => {
        const codigoCurto = (item.codigo || 'DEP').slice(0, 6);
        const isEmBreve =
          ['ATD-01', 'COZ-01'].includes(item.codigo) ||
          ['atendimento', 'cozinha'].includes(item.nome.toLowerCase());

        return (
          <div
            key={item.id}
            onClick={() => {
              if (!isEmBreve) onViewDetail(item);
            }}
            className={`relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group ${
              isEmBreve
                ? 'cursor-not-allowed select-none'
                : 'hover:border-slate-300 hover:shadow-md cursor-pointer'
            }`}
          >
            {/* Overlay com Blur e Mensagem para Departamentos em Breve (Descentralizado à esquerda) */}
            {isEmBreve && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2.5px] rounded-3xl flex items-center justify-start px-5 sm:px-8 cursor-not-allowed select-none"
              >
                <div className="bg-white/95 border border-slate-200/90 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3.5 max-w-xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200/60 inline-block mb-0.5">
                      Funcionalidade em Breve
                    </span>
                    <p className="text-xs font-bold text-slate-700 leading-snug">
                      Esta área está sendo aprimorada e estará disponível nas próximas atualizações.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo do Departamento */}
            <div
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-1 w-full ${
                isEmBreve ? 'filter blur-[1.5px] opacity-40 pointer-events-none' : ''
              }`}
            >
            {/* Lado Esquerdo: Box de Código + Informações do Departamento */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              {/* Badge Box estilo CMD */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 flex flex-col items-center justify-center shadow-2xs group-hover:scale-105 transition-transform px-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500">
                    SETOR
                  </span>
                  <span className="text-xs font-black font-mono text-indigo-700 leading-none truncate max-w-full">
                    {codigoCurto}
                  </span>
                </div>
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

                {/* Linha 2: Equipe */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
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

            {/* Lado Direito: Botão de Ação */}
            <div
              className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end"
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
        </div>
      );
    })}
    </div>
  );
}

