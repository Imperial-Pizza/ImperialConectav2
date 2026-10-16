import type { NovoProdutoPesado, ProdutoPesado } from '../types';

export const PRODUTOS_PESADOS_MOCK: ProdutoPesado[] = [
  {
    id: 1,
    codigo: 'PES-001',
    nome: 'Muçarela Triturada / Ralada (Saco 5kg)',
    categoria: 'Queijos & Frios',
    insumoOrigem: 'Muçarela em Peça (INS-002)',
    pesoUnitarioKg: 5.0,
    quantidadePacotes: 7,
    pesoTotalKg: 35.0,
    pesoMinimoKg: 20.0,
    custoPorKg: 32.9,
    dataPesagem: '2026-10-15',
    dataValidade: '2026-10-22',
    lote: 'LT-MUC-2610A',
    temperatura: '1°C a 4°C (Câmara Fria)',
    rendimentoPercentual: 98.5,
    responsavel: 'Equipe de Manhã (Carlos & Tiago)',
    observacoes: 'Processado no triturador com lâmina 4mm. Selado a vácuo em embalagem reforçada.',
  },
  {
    id: 2,
    codigo: 'PES-002',
    nome: 'Calabresa Especial Fatiada (Pacote 2kg)',
    categoria: 'Carnes & Embutidos',
    insumoOrigem: 'Calabresa Defumada Peça Inteira',
    pesoUnitarioKg: 2.0,
    quantidadePacotes: 4,
    pesoTotalKg: 8.0,
    pesoMinimoKg: 10.0,
    custoPorKg: 26.5,
    dataPesagem: '2026-10-16',
    dataValidade: '2026-10-24',
    lote: 'LT-CAL-2610B',
    temperatura: '2°C a 6°C (Refrigerado)',
    rendimentoPercentual: 99.2,
    responsavel: 'Matheus Cozinha',
    observacoes: 'Fatiamento fino calibrado a 2mm para assamento homogêneo.',
  },
  {
    id: 3,
    codigo: 'PES-003',
    nome: 'Frango Cozido & Desfiado Temperado (Pacote 2.5kg)',
    categoria: 'Carnes & Embutidos',
    insumoOrigem: 'Peito de Frango Resfriado',
    pesoUnitarioKg: 2.5,
    quantidadePacotes: 6,
    pesoTotalKg: 15.0,
    pesoMinimoKg: 10.0,
    custoPorKg: 22.8,
    dataPesagem: '2026-10-14',
    dataValidade: '2026-10-19',
    lote: 'LT-FRA-2610C',
    temperatura: '0°C a 3°C (Câmara Resfriada)',
    rendimentoPercentual: 73.8,
    responsavel: 'Luciana Chef',
    observacoes: 'Cozido em caldo de legumes aromático e desfiado na batedeira industrial.',
  },
  {
    id: 4,
    codigo: 'PES-004',
    nome: 'Bacon em Cubos Pré-Frito (Pacote 1kg)',
    categoria: 'Carnes & Embutidos',
    insumoOrigem: 'Manta de Bacon Defumada',
    pesoUnitarioKg: 1.0,
    quantidadePacotes: 6,
    pesoTotalKg: 6.0,
    pesoMinimoKg: 5.0,
    custoPorKg: 42.0,
    dataPesagem: '2026-10-13',
    dataValidade: '2026-10-25',
    lote: 'LT-BAC-2610D',
    temperatura: '2°C a 5°C',
    rendimentoPercentual: 81.5,
    responsavel: 'Matheus Cozinha',
    observacoes: 'Fritura leve apenas para selar a gordura e garantir crocância no forno.',
  },
  {
    id: 5,
    codigo: 'PES-005',
    nome: 'Massa Matura Bolinhas 350g (Caixa 12 un - 4.2kg)',
    categoria: 'Massas & Bases',
    insumoOrigem: 'Farinha Tipo 00 Italiana (INS-001)',
    pesoUnitarioKg: 4.2,
    quantidadePacotes: 11,
    pesoTotalKg: 46.2,
    pesoMinimoKg: 25.0,
    custoPorKg: 7.9,
    dataPesagem: '2026-10-16',
    dataValidade: '2026-10-19',
    lote: 'LT-MAS-2610E',
    temperatura: '2°C a 4°C (Fermentação 48h)',
    rendimentoPercentual: 100.0,
    responsavel: 'Pizzaiolo Chefe (Rafa)',
    observacoes: '12 bolinhas por caixa polvilhadas com semolina, prontas para abertura.',
  },
  {
    id: 6,
    codigo: 'PES-006',
    nome: 'Molho de Tomate Temperado da Casa (Bag 5kg)',
    categoria: 'Molhos & Recheios',
    insumoOrigem: 'Tomate Pelati San Marzano (INS-003)',
    pesoUnitarioKg: 5.0,
    quantidadePacotes: 5,
    pesoTotalKg: 25.0,
    pesoMinimoKg: 15.0,
    custoPorKg: 13.6,
    dataPesagem: '2026-10-15',
    dataValidade: '2026-10-21',
    lote: 'LT-MOL-2610F',
    temperatura: '2°C a 5°C',
    rendimentoPercentual: 96.0,
    responsavel: 'Equipe de Manhã',
    observacoes: 'Processado com azeite extravirgem, sal marinho e folhas frescas de manjericão.',
  },
  {
    id: 7,
    codigo: 'PES-007',
    nome: 'Cebola Roxa Fatiada Julienne (Pote 1.5kg)',
    categoria: 'Vegetais & Porções',
    insumoOrigem: 'Cebola Roxa in Natura',
    pesoUnitarioKg: 1.5,
    quantidadePacotes: 2,
    pesoTotalKg: 3.0,
    pesoMinimoKg: 4.5,
    custoPorKg: 9.5,
    dataPesagem: '2026-10-16',
    dataValidade: '2026-10-18',
    lote: 'LT-CEB-2610G',
    temperatura: '3°C a 6°C',
    rendimentoPercentual: 88.0,
    responsavel: 'Ajudante Cozinha',
    observacoes: 'Corte fino 1.5mm, sem lágrimas, armazenado com filme plástico protetor.',
  },
  {
    id: 8,
    codigo: 'PES-008',
    nome: 'Queijo Gorgonzola Picado / Esfarelado (Pote 1kg)',
    categoria: 'Queijos & Frios',
    insumoOrigem: 'Forma Inteira Gorgonzola DOP',
    pesoUnitarioKg: 1.0,
    quantidadePacotes: 3,
    pesoTotalKg: 3.0,
    pesoMinimoKg: 2.0,
    custoPorKg: 58.0,
    dataPesagem: '2026-10-12',
    dataValidade: '2026-10-22',
    lote: 'LT-GOR-2610H',
    temperatura: '1°C a 4°C',
    rendimentoPercentual: 97.5,
    responsavel: 'Carlos & Tiago',
    observacoes: 'Esfarelado manual para cobertura homogênea na pizza Quatro Queijos.',
  },
];

export async function fetchProdutosPesados(): Promise<ProdutoPesado[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return [...PRODUTOS_PESADOS_MOCK];
}

export async function createProdutoPesado(dados: NovoProdutoPesado): Promise<ProdutoPesado> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const pesoTotalKg = Number((dados.quantidadePacotes * dados.pesoUnitarioKg).toFixed(2));
  return {
    ...dados,
    id: Date.now(),
    pesoTotalKg,
  };
}

export async function updateProdutoPesado(
  id: number,
  dados: Partial<NovoProdutoPesado>
): Promise<ProdutoPesado> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const item = PRODUTOS_PESADOS_MOCK.find((p) => p.id === id);
  const quantidadePacotes = dados.quantidadePacotes ?? item?.quantidadePacotes ?? 1;
  const pesoUnitarioKg = dados.pesoUnitarioKg ?? item?.pesoUnitarioKg ?? 1;
  const pesoTotalKg = Number((quantidadePacotes * pesoUnitarioKg).toFixed(2));

  return {
    ...(item || ({} as ProdutoPesado)),
    ...dados,
    id,
    pesoTotalKg,
  } as ProdutoPesado;
}

export async function deleteProdutoPesado(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
}

export function isLoteBaixo(item: ProdutoPesado): boolean {
  return item.pesoTotalKg <= item.pesoMinimoKg;
}
