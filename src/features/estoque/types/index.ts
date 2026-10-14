export type EstoqueSubModule = 'estoque' | 'cmv';

export type EstoqueViewMode = 'table' | 'cards';

export interface Insumo {
  id: number;
  /** Código único do insumo (ex: INS-001, FAR-01) */
  codigo: string;
  /** Categoria do produto (Massas, Frios, Molhos, etc.) */
  categoria: string;
  /** Nome comercial do produto/insumo */
  nome: string;
  /** Unidade de medida (kg, un, L, cx, etc.) */
  unidade: string;
  /** Quantidade mínima antes de disparar o alerta de estoque baixo */
  min: number;
  /** Custo unitário / Preço médio pago (R$) */
  custoUnitario: number;
  /** Quantidade atual disponível em estoque */
  qtd: number;
  /** Nome ou razão social do fornecedor principal */
  fornecedor: string;
  /** Notas adicionais ou observações de armazenagem/lote */
  observacoes?: string;
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
