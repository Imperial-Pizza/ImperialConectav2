'use client';

import { Building2, Sparkles } from 'lucide-react';

interface DepartamentosSidebarProps {
  totalCount?: number;
}

export function DepartamentosSidebar({ totalCount = 0 }: DepartamentosSidebarProps) {
  return (
    <>
      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================== */}
      <nav
        aria-label="Navegação móvel do módulo de departamentos"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-4 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-center w-full max-w-md mx-auto">
          <button
            type="button"
            aria-current="page"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center py-2 px-6 rounded-2xl transition-all cursor-pointer relative bg-red-50 text-red-600 font-black shadow-xs"
          >
            <div className="relative flex items-center justify-center">
              <Building2 className="w-5 h-5 text-red-600 stroke-[2.3]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-3 min-w-[16px] h-[15px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight text-red-600 font-bold">
              Departamentos
            </span>
          </button>
        </div>
      </nav>

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================== */}
      <aside className="hidden md:block w-72 shrink-0 md:sticky md:top-24 self-start z-10">
        <nav
          aria-label="Módulos de gestão de departamentos"
          className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-2 max-h-[calc(100vh-7rem)] overflow-y-auto"
        >
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Módulos de Gestão
          </div>

          <button
            type="button"
            aria-current="page"
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/10"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Departamentos</span>
            </div>

            {totalCount > 0 && (
              <span
                title={`${totalCount} departamentos cadastrados`}
                className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight bg-white/15 text-white shadow-xs"
              >
                {totalCount}
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 px-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Dica Imperial</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Consulte os setores, centros de custo, gestores responsáveis e os colaboradores vinculados a cada departamento.
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

