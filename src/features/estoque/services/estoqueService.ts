import type { CmvPeriodoTipo, CmvResultado, CmvValores, Insumo, NovoInsumo } from '../types';

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
  {
    id: 7,
    codigo: 'INS-007',
    nome: 'Muçarela Triturada / Ralada (Saco 5kg)',
    categoria: 'Frios & Laticínios',
    qtd: 25,
    unidade: 'kg',
    custoUnitario: 34.0,
    min: 30,
    fornecedor: 'Laticínios Scala',
    observacoes: '5 pacotes de 5kg selados a vácuo na câmara fria',
  },
  {
    id: 8,
    codigo: 'INS-008',
    nome: 'Calabresa Especial Fatiada (Pacote 2kg)',
    categoria: 'Embutidos',
    qtd: 14,
    unidade: 'kg',
    custoUnitario: 28.5,
    min: 10,
    fornecedor: 'Frigorífico Ceratti',
    observacoes: 'Fatiamento padrão 2mm para montagem rápida',
  },
  {
    id: 9,
    codigo: 'INS-009',
    nome: 'Frango Cozido & Desfiado Temperado (Pacote 2.5kg)',
    categoria: 'Embutidos',
    qtd: 15,
    unidade: 'kg',
    custoUnitario: 22.8,
    min: 12,
    fornecedor: 'Distribuidora Bella Itália',
    observacoes: 'Peito desfiado temperado com azeite e ervas finas',
  },
  {
    id: 10,
    codigo: 'INS-010',
    nome: 'Bacon Picado em Cubos (Pacote 1kg)',
    categoria: 'Embutidos',
    qtd: 8,
    unidade: 'kg',
    custoUnitario: 42.0,
    min: 5,
    fornecedor: 'Frigorífico Ceratti',
    observacoes: 'Cubos uniformes fritos e pré-porcionados',
  },
];

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

const STORAGE_KEY_INSUMOS = 'imperial_estoque_insumos_v1';

export async function fetchInsumos(): Promise<Insumo[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSUMOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro de parsing
    }
  }
  return [...INSUMOS_MOCK];
}

function persistirInsumos(items: Insumo[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_INSUMOS, JSON.stringify(items));
    } catch {
      // Ignora erro de escrita
    }
  }
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

/**
 * Calcula valores de CMV dinâmicos sincronizados com o estoque real.
 * Utiliza o somatório do saldo dos insumos (qtd * custoUnitario),
 * histórico de balanço para aferir o saldo inicial e estimativas proporcionais
 * aos dias do ciclo de apuração.
 */
export function gerarCmvDeEstoqueReal(
  insumos: Insumo[],
  periodo: CmvPeriodoTipo,
  faturamentoManual?: number
): CmvValores {
  // Saldo real de estoque atual (Estoque Final)
  const saldoAtualEstoque = insumos.reduce(
    (acc, item) => acc + item.qtd * item.custoUnitario,
    0
  );

  const config = CMV_PERIODOS_CONFIG[periodo];
  const dias = config.dias;

  // Se houver histórico de balanço no localStorage, recuperamos contagens anteriores
  let saldoInicialAferido = saldoAtualEstoque;
  if (typeof window !== 'undefined') {
    try {
      const historicoRaw = localStorage.getItem('imperial_estoque_balanco_historico_v1');
      if (historicoRaw) {
        const historico = JSON.parse(historicoRaw);
        if (Array.isArray(historico) && historico.length > 0) {
          // Último balanço realizado
          const ultimo = historico[0];
          const valorAferido = ultimo.itens.reduce(
            (acc: number, it: { qtdFisica: number; custoUnitario?: number; codigo?: string }) => {
              const insumoOriginal = insumos.find((i) => i.codigo === it.codigo);
              const custo = insumoOriginal ? insumoOriginal.custoUnitario : 20;
              return acc + (it.qtdFisica || 0) * custo;
            },
            0
          );
          if (valorAferido > 0) {
            saldoInicialAferido = valorAferido;
          }
        }
      }
    } catch {
      // Ignora erro de leitura
    }
  }

  // Fator diário com base no tamanho do estoque para pizzarias (giro médio de estoque entre 7 e 12 dias)
  // Em uma pizzaria típica, o giro é de ~10 dias.
  const consumoDiarioEstimado = saldoAtualEstoque > 0 ? (saldoAtualEstoque / 8.5) : 1300;
  const faturamentoDiarioEstimado = consumoDiarioEstimado / 0.28; // ~28% de CMV alvo

  const estoqueFinal = Number(saldoAtualEstoque.toFixed(2));
  
  // Para dias = 1: estoqueInicial é o saldo de ontem ou ligeiramente acima
  // Compras são as entradas proporcionais do período
  const comprasPeriodo = Number((consumoDiarioEstimado * dias * 0.95).toFixed(2));
  const variacaoEstoque = consumoDiarioEstimado * (dias * 0.05);
  const estoqueInicial = Number((saldoAtualEstoque + variacaoEstoque).toFixed(2));

  const faturamentoTotal = faturamentoManual !== undefined && faturamentoManual > 0
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
