import type { CmvResultado, CmvValores, Insumo, NovoInsumo } from '../types';

/**
 * Dados de exemplo com a estrutura real de colunas da Imperial Pizza:
 * Código, Categoria, Produto, Unidade, Estoque Mínimo, Preço Médio, Fornecedor Principal, Observações.
 */
const INSUMOS_MOCK: Insumo[] = [
  {
    id: 1,
    codigo: 'INS-001',
    nome: 'Farinha de Trigo Especial (Italiana)',
    categoria: 'Massas',
    qtd: 140,
    unidade: 'kg',
    custoUnitario: 6.5,
    min: 50,
    fornecedor: 'Moinho Caputo / Importadora',
    observacoes: 'Tipo 00 para fermentação longa (48h)',
  },
  {
    id: 2,
    codigo: 'INS-002',
    nome: 'Muçarela em Peça',
    categoria: 'Frios & Laticínios',
    qtd: 35,
    unidade: 'kg',
    custoUnitario: 32.0,
    min: 40,
    fornecedor: 'Laticínios Scala',
    observacoes: 'Manter entre 1°C e 4°C na câmara fria',
  },
  {
    id: 3,
    codigo: 'INS-003',
    nome: 'Molho de Tomate Pelati (Lata 2.5kg)',
    categoria: 'Molhos',
    qtd: 18,
    unidade: 'un',
    custoUnitario: 24.9,
    min: 15,
    fornecedor: 'Distribuidora Bella Itália',
    observacoes: 'San Marzano DOP legítimo',
  },
  {
    id: 4,
    codigo: 'INS-004',
    nome: 'Pepperoni Importado',
    categoria: 'Embutidos',
    qtd: 12,
    unidade: 'kg',
    custoUnitario: 58.0,
    min: 10,
    fornecedor: 'Frigorífico Ceratti',
    observacoes: 'Fatiamento fino para borda crocante',
  },
  {
    id: 5,
    codigo: 'INS-005',
    nome: 'Fermento Biológico Fresco',
    categoria: 'Massas',
    qtd: 4,
    unidade: 'kg',
    custoUnitario: 18.5,
    min: 5,
    fornecedor: 'Fleischmann Brasil',
    observacoes: 'Recebimento diário / conferir lote',
  },
  {
    id: 6,
    codigo: 'INS-006',
    nome: 'Manjericão Fresco',
    categoria: 'Hortifrúti',
    qtd: 2,
    unidade: 'kg',
    custoUnitario: 25.0,
    min: 3,
    fornecedor: 'Horta Orgânica São José',
    observacoes: 'Folhas inteiras lavadas e higienizadas',
  },
];

export const CMV_INICIAL: CmvValores = {
  estoqueInicial: 12500,
  comprasPeriodo: 18400,
  estoqueFinal: 11200,
  faturamentoTotal: 65000,
};

export async function fetchInsumos(): Promise<Insumo[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...INSUMOS_MOCK];
}

export async function createInsumo(insumo: NovoInsumo): Promise<Insumo> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { ...insumo, id: Date.now() };
}

export async function updateInsumo(id: number, dados: Partial<NovoInsumo>): Promise<Insumo> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id, ...dados } as Insumo;
}

export async function deleteInsumo(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}

export function isEstoqueBaixo(item: Insumo): boolean {
  return item.qtd <= item.min;
}

export function valorTotalInsumo(item: Insumo): number {
  return item.qtd * item.custoUnitario;
}

/** CMV = Estoque Inicial + Compras do Período - Estoque Final */
export function calcularCmv(valores: CmvValores): CmvResultado {
  const cmvGlobal =
    valores.estoqueInicial + valores.comprasPeriodo - valores.estoqueFinal;

  return {
    cmvGlobal,
    cmvPercentual:
      valores.faturamentoTotal > 0
        ? (cmvGlobal / valores.faturamentoTotal) * 100
        : 0,
    margemContribuicao: valores.faturamentoTotal - cmvGlobal,
  };
}
