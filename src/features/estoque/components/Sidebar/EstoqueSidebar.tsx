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
  icon: LucideIcon;
  activeIconColor: string;
}[] = [
  { id: 'estoque', label: 'Controle de Estoque', icon: Package, activeIconColor: 'text-amber-400' },
  { id: 'produtos-pesados', label: 'Produtos Pesados', icon: Scale, activeIconColor: 'text-emerald-400' },
  { id: 'fornecedores', label: 'Fornecedores', icon: Truck, activeIconColor: 'text-blue-400' },
  { id: 'balanco', label: 'Balanço de Estoque', icon: ClipboardCheck, activeIconColor: 'text-purple-400' },
  { id: 'cmv', label: 'Cálculo de CMV Global', icon: BarChart3, activeIconColor: 'text-red-400' },
];

export function EstoqueSidebar({ active, lowStockCount = 0, lowWeighedCount = 0, onChange }: EstoqueSidebarProps) {
  return (
    <aside className="w-full md:w-72 shrink-0">
      <nav
        aria-label="Módulos de gestão de estoque"
        className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm space-y-2 md:sticky md:top-28"
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
  );
}
