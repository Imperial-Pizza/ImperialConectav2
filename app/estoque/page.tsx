import type { Metadata } from 'next';

import EstoqueView from '@/features/estoque/components/EstoqueView';

export const metadata: Metadata = {
  title: 'Estoque & CMV | Imperial Pizza',
  description: 'Gestão de insumos, planilhas de estoque e cálculo de CMV da Imperial Pizza.',
};

export default function EstoquePage() {
  return <EstoqueView />;
}
