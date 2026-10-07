'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarTab<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface SidebarTabsProps<T extends string> {
  title: string;
  tabs: SidebarTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

/** Navegação lateral em abas (usada no Perfil e na Central de Metas). */
export function SidebarTabs<T extends string>({ title, tabs, activeTab, onChange }: SidebarTabsProps<T>) {
  return (
    <nav className="space-y-2" aria-label={title}>
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">{title}</p>

      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          id={`tab-${id}`}
          type="button"
          onClick={() => onChange(id)}
          aria-current={activeTab === id ? 'page' : undefined}
          className={cn(
            'w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3',
            activeTab === id
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
