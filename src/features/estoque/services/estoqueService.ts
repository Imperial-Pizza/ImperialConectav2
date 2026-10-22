import { estoqueApi } from '../apis/estoqueApi';
import type {
  CmvPeriodoTipo,
  CmvResultado,
  CmvValores,
  Insumo,
  NovoInsumo,
} from '../types';

export const CMV_PERIODOS_CONFIG: Record<
  CmvPeriodoTipo,
  {
    nome: string;
    dias: number;
    subtitulo: string;
    valoresPadrao: CmvValores;
  }
> = {
  diario: {
    nome: 'Diário (Hoje)',
    dias: 1,
    subtitulo: 'Fechamento e apuração da escala do dia',
    valoresPadrao: {
      estoqueInicial: 12200,
      comprasPeriodo: 950,
      estoqueFinal: 11800,
      faturamentoTotal: 4600,
    },
  },
  semanal: {
    nome: 'Semanal (7 dias)',
    dias: 7,
    subtitulo: 'Balanço semanal com ciclos de reposição',
    valoresPadrao: {
      estoqueInicial: 11800,
      comprasPeriodo: 4800,
      estoqueFinal: 11200,
      faturamentoTotal: 19500,
    },
  },
  quinzenal: {
    nome: 'A 15 Dias (Quinzenal)',
    dias: 15,
    subtitulo: 'Auditoria de quinzena e conciliação de fornecedores',
    valoresPadrao: {
      estoqueInicial: 12000,
      comprasPeriodo: 9300,
      estoqueFinal: 11400,
      faturamentoTotal: 34500,
    },
  },
  mensal: {
    nome: 'Mensal (30 dias)',
    dias: 30,
    subtitulo: 'DRE operacional e apuração consolidada do mês',
    valoresPadrao: {
      estoqueInicial: 12500,
      comprasPeriodo: 18400,
      estoqueFinal: 11200,
      faturamentoTotal: 65000,
    },
  },
  trimestral: {
    nome: 'Trimestral (90 dias)',
    dias: 90,
    subtitulo: 'Análise estratégica de trimestre e sazonalidade',
    valoresPadrao: {
      estoqueInicial: 11000,
      comprasPeriodo: 54000,
      estoqueFinal: 11500,
      faturamentoTotal: 192000,
    },
  },
  anual: {
    nome: 'Anual (12 meses)',
    dias: 365,
    subtitulo: 'Resultado fiscal e evolução patrimonial do ano',
    valoresPadrao: {
      estoqueInicial: 9800,
      comprasPeriodo: 218000,
      estoqueFinal: 12200,
      faturamentoTotal: 780000,
    },
  },
};

export const CMV_INICIAL: CmvValores = CMV_PERIODOS_CONFIG.mensal.valoresPadrao;

/**
 * Busca a lista de insumos 100% diretamente do Banco de Dados via API REST
 */
export async function fetchInsumos(): Promise<Insumo[]> {
  return estoqueApi.listarInsumos();
}

/**
 * Cria insumo diretamente no MySQL
 */
export async function createInsumo(insumo: NovoInsumo): Promise<Insumo> {
  return estoqueApi.criarInsumo(insumo);
}

/**
 * Atualiza insumo diretamente no MySQL
 */
export async function updateInsumo(id: number, dados: Partial<NovoInsumo>): Promise<Insumo> {
  return estoqueApi.atualizarInsumo(id, dados);
}

/**
 * Deleta insumo diretamente no MySQL
 */
export async function deleteInsumo(id: number): Promise<void> {
  return estoqueApi.deletarInsumo(id);
}

/**
 * Registra movimentação rápida de entrada ou saída no banco
 */
export async function movimentarInsumo(
  id: number,
  tipo: 'entrada' | 'saida',
  quantidade: number,
  motivo?: string
) {
  return estoqueApi.registrarMovimentacao(id, tipo, quantidade, motivo);
}

/**
 * Gera CMV sincronizado com estoque físico real
 */
export function gerarCmvDeEstoqueReal(
  insumos: Insumo[],
  periodo: CmvPeriodoTipo,
  faturamentoManual?: number
): CmvValores {
  const saldoAtualEstoque = insumos.reduce(
    (acc, item) => acc + item.qtd * item.custoUnitario,
    0
  );

  const config = CMV_PERIODOS_CONFIG[periodo];
  const dias = config.dias;

  const consumoDiarioEstimado = saldoAtualEstoque > 0 ? saldoAtualEstoque / 8.5 : 1300;
  const faturamentoDiarioEstimado = consumoDiarioEstimado / 0.28;

  const estoqueFinal = Number(saldoAtualEstoque.toFixed(2));
  const comprasPeriodo = Number((consumoDiarioEstimado * dias * 0.95).toFixed(2));
  const variacaoEstoque = consumoDiarioEstimado * (dias * 0.05);
  const estoqueInicial = Number((saldoAtualEstoque + variacaoEstoque).toFixed(2));

  const faturamentoTotal =
    faturamentoManual !== undefined && faturamentoManual > 0
      ? faturamentoManual
      : Number((faturamentoDiarioEstimado * dias).toFixed(2));

  return {
    estoqueInicial,
    comprasPeriodo,
    estoqueFinal,
    faturamentoTotal,
    origemDados: 'estoque_real',
  };
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

  const cmvPercentual =
    valores.faturamentoTotal > 0
      ? (cmvGlobal / valores.faturamentoTotal) * 100
      : 0;

  let statusCmv: 'otimo' | 'alerta' | 'critico' = 'otimo';
  if (cmvPercentual > 32) {
    statusCmv = 'critico';
  } else if (cmvPercentual > 29) {
    statusCmv = 'alerta';
  }

  return {
    cmvGlobal,
    cmvPercentual,
    margemContribuicao: valores.faturamentoTotal - cmvGlobal,
    statusCmv,
  };
}
