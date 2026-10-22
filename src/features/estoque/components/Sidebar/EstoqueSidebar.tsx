'use client';

import { BarChart3, ClipboardCheck, Package, Scale, Sparkles, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { EstoqueSubModule } from '../../types';

interface EstoqueSidebarProps {
  active: EstoqueSubModule;
  lowStockCount?: number;
  lowWeighedCount?: number;
  onChange: (subModule: EstoqueSubModule) => void;
}

const ITEMS: {
  id: EstoqueSubModule;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  activeIconColor: string;
}[] = [
  { id: 'estoque', label: 'Controle de Estoque', mobileLabel: 'Estoque', icon: Package, activeIconColor: 'text-amber-400' },
  { id: 'produtos-pesados', label: 'Produtos Pesados', mobileLabel: 'Pesados', icon: Scale, activeIconColor: 'text-emerald-400' },
  { id: 'fornecedores', label: 'Fornecedores', mobileLabel: 'Fornecedores', icon: Truck, activeIconColor: 'text-blue-400' },
  { id: 'balanco', label: 'Balanço de Estoque', mobileLabel: 'Balanço', icon: ClipboardCheck, activeIconColor: 'text-purple-400' },
  { id: 'cmv', label: 'Cálculo de CMV Global', mobileLabel: 'CMV', icon: BarChart3, activeIconColor: 'text-red-400' },
];

export function EstoqueSidebar({ active, lowStockCount = 0, lowWeighedCount = 0, onChange }: EstoqueSidebarProps) {
  return (
    <>
      {/* =========================================================
          MOBILE BOTTOM NAVIGATION (Fixed 5-Tab Bar - Estilo App Nativo)
      ========================================================== */}
      <nav
        aria-label="Navegação móvel dos módulos de estoque"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto gap-1">
          {ITEMS.map(({ id, mobileLabel, icon: Icon }) => {
            const isActive = active === id;
            const badgeCount =
              id === 'estoque'
                ? lowStockCount
                : id === 'produtos-pesados'
                ? lowWeighedCount
                : 0;
            const showBadge = badgeCount > 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onChange(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-black shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-50'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-600 stroke-[2.3]' : 'text-slate-500 stroke-[1.8]'}`} />

                  {showBadge && (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                      {badgeCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] mt-1 tracking-tight truncate max-w-full ${
                    isActive ? 'text-red-600 font-bold' : 'text-slate-600 font-medium'
                  }`}
                >
                  {mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================== */}
      <aside className="hidden md:block w-72 shrink-0 md:sticky md:top-24 self-start z-10">
        <nav
          aria-label="Módulos de gestão de estoque"
          className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-2 max-h-[calc(100vh-7rem)] overflow-y-auto"
        >
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Módulos de Gestão
          </div>

          {ITEMS.map(({ id, label, icon: Icon, activeIconColor }) => {
            const isActive = active === id;
            const badgeCount =
              id === 'estoque'
                ? lowStockCount
                : id === 'produtos-pesados'
                ? lowWeighedCount
                : 0;
            const showBadge = badgeCount > 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? activeIconColor : 'text-slate-500'}`} />
                  <span>{label}</span>
                </div>

                {showBadge && (
                  <span
                    title={`${badgeCount} itens com estoque/lote baixo`}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight ${
                      isActive
                        ? 'bg-red-500 text-white shadow-xs'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 px-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Dica Imperial</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Mantenha o inventário atualizado semanalmente para apurar o CMV real e proteger sua margem de lucro.
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
