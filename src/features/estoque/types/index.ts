export type EstoqueSubModule = 'estoque' | 'produtos-pesados' | 'fornecedores' | 'balanco' | 'cmv';

export type EstoqueViewMode = 'table' | 'cards';

export type InsumoStatusFilter = 'todos' | 'critico' | 'mediano' | 'ok';

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

export interface ProdutoPesado {
  id: number;
  /** Código único da pesagem/lote (ex: PES-001) */
  codigo: string;
  /** Nome comercial do produto pesado/porcionado (ex: Muçarela Triturada 5kg) */
  nome: string;
  /** Categoria do produto pesado */
  categoria: string;
  /** Insumo de origem que foi fracionado/pesado (ex: Muçarela em Peça) */
  insumoOrigem: string;
  /** Peso unitário de cada pacote/porção em kg (ex: 5 para 5kg) */
  pesoUnitarioKg: number;
  /** Quantidade de pacotes/porções seladas disponíveis */
  quantidadePacotes: number;
  /** Peso total disponível em estoque (quantidadePacotes * pesoUnitarioKg) */
  pesoTotalKg: number;
  /** Peso mínimo de segurança antes de disparar alerta */
  pesoMinimoKg: number;
  /** Custo apurado por kg (R$) */
  custoPorKg: number;
  /** Data da pesagem / fracionamento */
  dataPesagem: string;
  /** Data de validade da etiqueta */
  dataValidade: string;
  /** Identificador do lote de preparo (ex: LT-2610-01) */
  lote: string;
  /** Temperatura de conservação (ex: 1°C a 4°C na câmara fria) */
  temperatura?: string;
  /** Rendimento percentual obtido no fracionamento */
  rendimentoPercentual?: number;
  /** Responsável ou equipe que realizou a pesagem */
  responsavel: string;
  /** Observações adicionais */
  observacoes?: string;
}

export type NovoProdutoPesado = Omit<ProdutoPesado, 'id' | 'pesoTotalKg'>;

export type StatusDivergencia = 'bateu' | 'falta' | 'sobra' | 'pendente';

export type FiltroBalancoStatus = 'todos' | 'divergentes' | 'bateu' | 'pendentes';

export interface ItemBalanco {
  insumoId: number;
  codigo: string;
  nome: string;
  categoria: string;
  unidade: string;
  custoUnitario: number;
  qtdSistema: number;
  qtdFisica: number | null;
  divergenciaQtd: number;
  divergenciaValor: number;
  motivo?: string;
  status: StatusDivergencia;
}

export interface HistoricoBalancoItem {
  codigo: string;
  nome: string;
  unidade: string;
  qtdSistema: number;
  qtdFisica: number;
  divergenciaQtd: number;
  divergenciaValor: number;
  motivo?: string;
}

export interface HistoricoBalanco {
  id: string;
  dataHora: string;
  responsavel: string;
  totalItensContados: number;
  totalItensDivergentes: number;
  impactoFinanceiroTotal: number;
  totalPerdas: number;
  totalSobras: number;
  itens: HistoricoBalancoItem[];
}

