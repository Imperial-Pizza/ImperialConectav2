import type { CmvResultado, CmvValores, Insumo, NovoInsumo } from '../types';

/**
 * Dados mockados enquanto o backend de estoque não está disponível.
 * Para integrar, troque as implementações por chamadas a `estoqueApi`.
 */
const INSUMOS_MOCK: Insumo[] = [
  { id: 1, nome: 'Farinha de Trigo Especial (Italiana)', categoria: 'Massas', qtd: 140, unidade: 'kg', custoUnitario: 6.5, min: 50 },
  { id: 2, nome: 'Muçarela em Peça', categoria: 'Frios & Laticínios', qtd: 35, unidade: 'kg', custoUnitario: 32.0, min: 40 },
  { id: 3, nome: 'Molho de Tomate Pelati (Lata 2.5kg)', categoria: 'Molhos', qtd: 18, unidade: 'un', custoUnitario: 24.9, min: 15 },
  { id: 4, nome: 'Pepperoni Importado', categoria: 'Embutidos', qtd: 12, unidade: 'kg', custoUnitario: 58.0, min: 10 },
  { id: 5, nome: 'Fermento Biológico Fresco', categoria: 'Massas', qtd: 4, unidade: 'kg', custoUnitario: 18.5, min: 5 },
  { id: 6, nome: 'Manjericão Fresco', categoria: 'Hortifrúti', qtd: 2, unidade: 'kg', custoUnitario: 25.0, min: 3 },
];

export const CMV_INICIAL: CmvValores = {
  estoqueInicial: 12500,
  comprasPeriodo: 18400,
  estoqueFinal: 11200,
  faturamentoTotal: 65000,
};

export async function fetchInsumos(): Promise<Insumo[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...INSUMOS_MOCK];
}

export async function createInsumo(insumo: NovoInsumo): Promise<Insumo> {
  return { ...insumo, id: Date.now() };
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
