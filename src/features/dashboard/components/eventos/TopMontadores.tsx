'use client';

import type { MontadorRanking } from './types';

interface TopMontadoresProps {
  montadores: MontadorRanking[];
}

function getRankStyles(rank: number): string {
  switch (rank) {
    case 1:
      return 'border border-amber-300 bg-amber-100 text-amber-700';
    case 2:
      return 'border border-slate-200 bg-slate-100 text-slate-700';
    case 3:
      return 'border border-orange-200 bg-orange-50 text-orange-700';
    default:
      return 'bg-slate-50 text-slate-500';
  }
}

export function TopMontadores({ montadores }: TopMontadoresProps) {
  return (
    <section className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-black tracking-tight text-slate-900">
          Top Montadores
        </h3>

        <p className="text-xs font-medium text-slate-500">
          Ranking deste mês
        </p>
      </div>

      {montadores.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-bold text-slate-700">
            Ranking indisponível
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Ainda não há dados para exibir.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {montadores.map((montador) => (
            <div
              key={`${montador.rank}-${montador.name}`}
              className="flex items-center justify-between gap-3 border-b border-slate-50 py-1 last:border-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getRankStyles(montador.rank)}`}
                  aria-label={`${montador.rank}º lugar`}
                >
                  {montador.rank}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {montador.name}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    {montador.role}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-xl border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-black text-red-600">
                {montador.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}