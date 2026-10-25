import type { Insumo } from '../types';

const HEADERS = [
  'Código',
  'Categoria',
  'Produto',
  'Unidade',
  'Quantidade Atual',
  'Estoque Mínimo',
  'Preço Médio (R$)',
  'Valor Total (R$)',
  'Fornecedor Principal',
  'Observações',
];

// BOM garante que o Excel reconheça acentuação (UTF-8)
const BOM = '\uFEFF';

function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

function baixarArquivo(conteudo: string, nome: string, mimeType: string) {
  const blob = new Blob([BOM + conteudo], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escaparCsv(valor: string | number | undefined): string {
  if (valor === undefined || valor === null) return '';
  const texto = String(valor);
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function toRow(item: Insumo): (string | number)[] {
  return [
    item.codigo || `INS-${item.id}`,
    item.categoria,
    item.nome,
    item.unidade,
    item.qtd,
    item.min,
    item.custoUnitario,
    item.qtd * item.custoUnitario,
    item.fornecedor || 'Não informado',
    item.observacoes || '',
  ];
}

export function exportarCsv(items: Insumo[]) {
  const linhas = [HEADERS, ...items.map(toRow)].map((cols) =>
    cols.map(escaparCsv).join(','),
  );

  baixarArquivo(
    linhas.join('\n'),
    `imperial_pizza_estoque_${hoje()}.csv`,
    'text/csv;charset=utf-8;',
  );
}

const HEADERS_FORNECEDORES = [
  'Código',
  'Nome Fantasia',
  'Razão Social',
  'CNPJ',
  'Categoria',
  'Representante',
  'Telefone',
  'E-mail',
  'Cidade',
  'UF',
  'Prazo de Entrega',
  'Condição de Pagamento',
  'Status',
  'Insumos Fornecidos',
  'Observações',
];

export function exportarFornecedoresCsv(fornecedores: import('../types').Fornecedor[]) {
  const linhas = [
    HEADERS_FORNECEDORES,
    ...fornecedores.map((f) => [
      `FOR-${String(f.id).padStart(3, '0')}`,
      f.nome,
      f.razaoSocial || '',
      f.cnpj,
      f.categoria,
      f.contatoNome,
      f.telefone,
      f.email,
      f.cidade,
      f.estado,
      f.prazoEntrega,
      f.condicaoPagamento,
      f.status,
      (f.insumosVinculados || []).join('; '),
      f.observacoes || '',
    ]),
  ].map((cols) => cols.map(escaparCsv).join(','));

  baixarArquivo(
    linhas.join('\n'),
    `imperial_pizza_fornecedores_${hoje()}.csv`,
    'text/csv;charset=utf-8;',
  );
}

/** Gera planilha separada por tabulação, aberta nativamente pelo Excel. */
export function exportarExcel(items: Insumo[]) {
  const linhas = [HEADERS, ...items.map(toRow)].map((cols) => cols.join('\t'));

  baixarArquivo(
    linhas.join('\n'),
    `imperial_pizza_planilha_${hoje()}.xls`,
    'application/vnd.ms-excel;charset=utf-8;',
  );
}

/** Divide uma linha CSV respeitando campos entre aspas. */
function dividirLinha(linha: string, delimitador: string): string[] {
  if (delimitador === '\t') return linha.split('\t');

  const colunas: string[] = [];
  let atual = '';
  let entreAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const char = linha[i];

    if (char === '"') {
      if (entreAspas && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else {
        entreAspas = !entreAspas;
      }
    } else if (char === delimitador && !entreAspas) {
      colunas.push(atual);
      atual = '';
    } else {
      atual += char;
    }
  }

  colunas.push(atual);
  return colunas;
}

function parseNumero(val: string | undefined, padrao = 0): number {
  if (!val) return padrao;
  const limpo = val.trim().replace(/^"|"$/g, '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const num = parseFloat(limpo);
  return isNaN(num) ? padrao : num;
}

export function parsePlanilha(texto: string): Insumo[] {
  const linhas = texto
    .replace(BOM, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (linhas.length < 2) return [];

  // Detecta delimitador: tabulação, ponto-e-vírgula (padrão Excel BR) ou vírgula
  const cabecalho = linhas[0];
  let delimitador = ',';
  if (cabecalho.includes('\t')) {
    delimitador = '\t';
  } else if (cabecalho.includes(';')) {
    delimitador = ';';
  }

  const base = Date.now();

  // Linha 0 é o cabeçalho
  return linhas.slice(1).flatMap((linha, index) => {
    const cols = dividirLinha(linha, delimitador).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 2) return [];

    const id = base + index;
    const codigo = cols[0] || `INS-${String(index + 1).padStart(3, '0')}`;
    const categoria = cols[1] || 'Massas';
    const nome = cols[2] || `Insumo Importado ${index + 1}`;
    const unidade = cols[3] || 'kg';
    const qtd = parseNumero(cols[4], 0);
    const min = parseNumero(cols[5], 5);
    const custoUnitario = parseNumero(cols[6], 0);
    const fornecedor = cols[8] || 'Fornecedor Padrão';
    const observacoes = cols[9] || '';

    return [
      {
        id,
        codigo,
        categoria,
        nome,
        unidade,
        qtd,
        min,
        custoUnitario,
        fornecedor,
        observacoes,
      },
    ];
  });
}

export function lerArquivoTexto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
