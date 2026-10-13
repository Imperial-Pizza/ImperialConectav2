'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { ModuleCard } from './ModuleCard';
import type {
  DashboardModule,
  ModulesSectionProps,
} from './types';

export default function ModulesSection({
  modules,
  onSelectModule,
}: ModulesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedQuery) {
      return modules;
    }

    return modules.filter((module) => {
      const searchableText = [
        module.name,
        module.desc,
        module.id,
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      return searchableText.includes(normalizedQuery);
    });
  }, [modules, searchQuery]);

  return (
    <section
      aria-labelledby="modules-section-title"
      className="space-y-4 pt-2"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2
            id="modules-section-title"
            className="text-xl font-black tracking-tight text-slate-900"
          >
            Módulos do Sistema
          </h2>

          <span className="text-xs font-medium text-slate-500">
            {filteredModules.length} de {modules.length} módulos disponíveis
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Pesquisar módulos..."
            aria-label="Pesquisar módulos do sistema"
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/10"
          />
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-800">
            Nenhum módulo encontrado
          </p>

          <p className="text-xs text-slate-500">
            Tente buscar por outro termo no campo de pesquisa acima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              onSelect={onSelectModule}
            />
          ))}
        </div>
      )}
    </section>
  );
}