'use client';

import { Toaster } from 'react-hot-toast';
import { AppShell } from '@/layouts/AppShell';

import { DepartamentosSidebar } from './DepartamentosSidebar';
import { DepartamentosPanel } from './DepartamentosPanel';
import { useDepartamentos } from '../hooks/useDepartamentos';

export default function DepartamentosView() {
  const departamentos = useDepartamentos();

  return (
    <AppShell activeModule="departamentos">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start w-full pb-20 md:pb-0">
        <DepartamentosSidebar totalCount={departamentos.total} />

        <div className="flex-1 min-w-0 w-full">
          <DepartamentosPanel departamentos={departamentos} />
        </div>
      </div>
    </AppShell>
  );
}

