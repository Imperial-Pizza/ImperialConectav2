import { estoqueApi } from '../apis/estoqueApi';
import type {
  CmvPeriodoTipo,
  CmvResultado,
  CmvValores,
  Insumo,
  NovoInsumo,
} from '../types';

/** Valores zerados — todos os números de CMV vêm exclusivamente da API */
export const CMV_VALORES_ZERADOS: CmvValores = {
  estoqueInicial: 0,
  comprasPeriodo: 0,
  estoqueFinal: 0,
  faturamentoTotal: 0,
};

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
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
  semanal: {
    nome: 'Semanal (7 dias)',
    dias: 7,
    subtitulo: 'Balanço semanal com ciclos de reposição',
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
  quinzenal: {
    nome: 'A 15 Dias (Quinzenal)',
    dias: 15,
    subtitulo: 'Auditoria de quinzena e conciliação de fornecedores',
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
  mensal: {
    nome: 'Mensal (30 dias)',
    dias: 30,
    subtitulo: 'DRE operacional e apuração consolidada do mês',
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
  trimestral: {
    nome: 'Trimestral (90 dias)',
    dias: 90,
    subtitulo: 'Análise estratégica de trimestre e sazonalidade',
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
  anual: {
    nome: 'Anual (12 meses)',
    dias: 365,
    subtitulo: 'Resultado fiscal e evolução patrimonial do ano',
    valoresPadrao: { ...CMV_VALORES_ZERADOS },
  },
};

export const CMV_INICIAL: CmvValores = { ...CMV_VALORES_ZERADOS };

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
