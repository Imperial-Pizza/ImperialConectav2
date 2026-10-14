import type { Insumo } from '../types';

const HEADERS = [
  'ID',
  'Nome',
  'Categoria',
  'Quantidade',
  'Unidade',
  'Custo Unitario (R$)',
  'Minimo',
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

function escaparCsv(valor: string | number): string {
  const texto = String(valor);
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function toRow(item: Insumo): (string | number)[] {
  return [
    item.id,
    item.nome,
    item.categoria,
    item.qtd,
    item.unidade,
    item.custoUnitario,
    item.min,
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

export function parsePlanilha(texto: string): Insumo[] {
  const linhas = texto
    .replace(BOM, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (linhas.length < 2) return [];

  const delimitador = linhas[0].includes('\t') ? '\t' : ',';
  const base = Date.now();

  // Linha 0 é o cabeçalho
  return linhas.slice(1).flatMap((linha, index) => {
    const cols = dividirLinha(linha, delimitador).map((c) => c.trim());
    if (cols.length < 6) return [];

    return [
      {
        id: base + index,
        nome: cols[1] || `Insumo Importado ${index + 1}`,
        categoria: cols[2] || 'Massas',
        qtd: parseFloat(cols[3]) || 0,
        unidade: cols[4] || 'kg',
        custoUnitario: parseFloat(cols[5]) || 0,
        min: parseFloat(cols[6]) || 5,
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
