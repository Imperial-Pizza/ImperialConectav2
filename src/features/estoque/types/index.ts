export type EstoqueSubModule = 'estoque' | 'cmv' | 'fornecedores';

export type EstoqueViewMode = 'table' | 'cards';

export interface Fornecedor {
  id: number;
  /** Nome fantasia ou nome principal do fornecedor */
  nome: string;
  /** Razão Social formal da empresa */
  razaoSocial?: string;
  /** CNPJ ou documento de identificação */
  cnpj: string;
  /** Categoria principal de insumos fornecidos */
  categoria: string;
  /** Nome do representante comercial ou vendedor */
  contatoNome: string;
  /** WhatsApp ou telefone comercial */
  telefone: string;
  /** E-mail para pedidos e cotações */
  email: string;
  /** Cidade */
  cidade: string;
  /** Estado / UF (ex: SP) */
  estado: string;
  /** Prazo padrão de entrega (ex: '24h', '2 a 3 dias úteis') */
  prazoEntrega: string;
  /** Condições comerciais de pagamento (ex: 'Boleto 28 dias', 'PIX faturado') */
  condicaoPagamento: string;
  /** Status da parceria */
  status: 'ativo' | 'inativo';
  /** Insumos ou produtos que este fornecedor entrega */
  insumosVinculados?: string[];
  /** Observações adicionais, dias de pedido, restrições */
  observacoes?: string;
}

export type NovoFornecedor = Omit<Fornecedor, 'id'>;

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
