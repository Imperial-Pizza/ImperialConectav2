import type { Metadata } from 'next';

import DepartamentosView from '@/features/departamentos/components/DepartamentosView';

export const metadata: Metadata = {
  title: 'Departamentos | Imperial Pizza',
  description: 'Visualização dos departamentos, centros de custo, gestores e equipes cadastradas.',
};

export default function DepartamentosPage() {
  return <DepartamentosView />;
}

