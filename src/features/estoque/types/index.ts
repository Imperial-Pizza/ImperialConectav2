export type EstoqueSubModule = 'estoque' | 'cmv';

export type EstoqueViewMode = 'table' | 'cards';

export interface Insumo {
  id: number;
  nome: string;
  categoria: string;
  qtd: number;
  unidade: string;
  custoUnitario: number;
  /** Quantidade mínima antes de disparar o alerta de estoque baixo */
  min: number;
}

export type NovoInsumo = Omit<Insumo, 'id'>;

export interface CmvValores {
  estoqueInicial: number;
  comprasPeriodo: number;
  estoqueFinal: number;
  faturamentoTotal: number;
}

export interface CmvResultado {
  cmvGlobal: number;
  cmvPercentual: number;
  margemContribuicao: number;
}
