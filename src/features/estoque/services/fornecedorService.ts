import type { Fornecedor, NovoFornecedor } from '../types';

const STORAGE_KEY = 'imperial_fornecedores_v1';

export const FORNECEDORES_MOCK: Fornecedor[] = [
  {
    id: 1,
    nome: 'Moinho Caputo / Importadora',
    razaoSocial: 'Caputo Brasil Importação e Comércio de Farinhas Ltda',
    cnpj: '14.285.912/0001-44',
    categoria: 'Massas & Farinhas',
    contatoNome: 'Giovanni Rossi',
    telefone: '(11) 98765-4321',
    email: 'giovanni@caputoimport.com.br',
    cidade: 'São Paulo',
    estado: 'SP',
    prazoEntrega: '48 horas',
    condicaoPagamento: 'Boleto 28 dias',
    status: 'ativo',
    insumosVinculados: ['Farinha de Trigo Especial (Italiana) Tipo 00', 'Semolina'],
    observacoes: 'Pedido mínimo: 10 sacos de 25kg. Entregas às terças e quintas.',
  },
  {
    id: 2,
    nome: 'Laticínios Scala',
    razaoSocial: 'Laticínios Scala Indústria e Comércio S/A',
    cnpj: '61.123.456/0001-78',
    categoria: 'Frios & Laticínios',
    contatoNome: 'Carlos Mendes',
    telefone: '(11) 99123-8899',
    email: 'pedidos@scala.com.br',
    cidade: 'Sacramento',
    estado: 'MG',
    prazoEntrega: '24h a 48h',
    condicaoPagamento: 'Boleto 21 dias',
    status: 'ativo',
    insumosVinculados: ['Muçarela em Peça', 'Parmesão Ralado', 'Provolone Defumado'],
    observacoes: 'Caminhão refrigerado. Entregar obrigatoriamente antes das 11h.',
  },
  {
    id: 3,
    nome: 'Distribuidora Bella Itália',
    razaoSocial: 'Bella Itália Comércio e Distribuição de Alimentos Eireli',
    cnpj: '22.333.444/0001-90',
    categoria: 'Molhos & Conservas',
    contatoNome: 'Roberto Bianchi',
    telefone: '(11) 97654-1122',
    email: 'vendas@bellaitalia.com.br',
    cidade: 'Campinas',
    estado: 'SP',
    prazoEntrega: '24 horas',
    condicaoPagamento: 'PIX faturado 15 dias',
    status: 'ativo',
    insumosVinculados: ['Molho de Tomate Pelati (Lata 2.5kg)', 'Azeite Extra Virgem Italiano'],
    observacoes: 'Desconto de 3% para pedidos acima de R$ 1.500,00.',
  },
  {
    id: 4,
    nome: 'Frigorífico Ceratti',
    razaoSocial: 'Ceratti Produtos Cárneos e Embutidos Ltda',
    cnpj: '33.444.555/0001-01',
    categoria: 'Embutidos & Carnes',
    contatoNome: 'Mariana Lima',
    telefone: '(11) 98456-7890',
    email: 'contato@ceratti.com.br',
    cidade: 'Vinhedo',
    estado: 'SP',
    prazoEntrega: '48 horas',
    condicaoPagamento: 'Boleto 30 dias',
    status: 'ativo',
    insumosVinculados: ['Pepperoni Importado', 'Calabresa Artesanal', 'Lombo Canadense'],
    observacoes: 'Recebimento sob inspeção de temperatura máxima de 4°C.',
  },
  {
    id: 5,
    nome: 'Fleischmann Brasil',
    razaoSocial: 'AB Brasil Indústria e Comércio de Alimentos Ltda',
    cnpj: '44.555.666/0001-12',
    categoria: 'Massas & Farinhas',
    contatoNome: 'André Souza',
    telefone: '(11) 99876-5432',
    email: 'vendas@fleischmann.com.br',
    cidade: 'São Paulo',
    estado: 'SP',
    prazoEntrega: 'Diário (matutino)',
    condicaoPagamento: 'Boleto 14 dias',
    status: 'ativo',
    insumosVinculados: ['Fermento Biológico Fresco', 'Fermento Seco'],
    observacoes: 'Conferir validade do lote no momento da entrega.',
  },
  {
    id: 6,
    nome: 'Horta Orgânica São José',
    razaoSocial: 'São José Hortigranjeiros Ltda - ME',
    cnpj: '55.666.777/0001-23',
    categoria: 'Hortifrúti & Frescos',
    contatoNome: 'Dona Maria & José',
    telefone: '(11) 98111-2233',
    email: 'contato@hortasaojose.com.br',
    cidade: 'Atibaia',
    estado: 'SP',
    prazoEntrega: 'Seg, Qua e Sex',
    condicaoPagamento: 'Semanal à vista (PIX)',
    status: 'ativo',
    insumosVinculados: ['Manjericão Fresco', 'Rúcula Selvática', 'Tomate Sweet Grape'],
    observacoes: 'Colheita da madrugada. Produto 100% orgânico certificado.',
  },
  {
    id: 7,
    nome: 'Imperial Pack Embalagens',
    razaoSocial: 'Imperial Embalagens e Descartáveis Industriais Eireli',
    cnpj: '66.777.888/0001-34',
    categoria: 'Embalagens & Descartáveis',
    contatoNome: 'Fernanda Rocha',
    telefone: '(11) 97222-3344',
    email: 'pedidos@imperialpack.com.br',
    cidade: 'Guarulhos',
    estado: 'SP',
    prazoEntrega: '3 dias úteis',
    condicaoPagamento: 'Boleto 30/60 dias',
    status: 'ativo',
    insumosVinculados: ['Caixas de Pizza Oitavada 35cm', 'Sacos Kraft Térmicos', 'Lacre de Segurança'],
    observacoes: 'Personalização com a marca Imperial Pizza.',
  },
];

function getStoredFornecedores(): Fornecedor[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveStoredFornecedores(fornecedores: Fornecedor[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fornecedores));
  } catch {
    // Ignore localStorage write error
  }
}

export async function fetchFornecedores(): Promise<Fornecedor[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const stored = getStoredFornecedores();
  if (stored && stored.length > 0) {
    return stored;
  }
  saveStoredFornecedores(FORNECEDORES_MOCK);
  return [...FORNECEDORES_MOCK];
}

export async function createFornecedor(novo: NovoFornecedor): Promise<Fornecedor> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = (await fetchFornecedores()) || [];
  const novoFornecedor: Fornecedor = {
    ...novo,
    id: Date.now(),
  };
  const updated = [novoFornecedor, ...current];
  saveStoredFornecedores(updated);
  return novoFornecedor;
}

export async function updateFornecedor(
  id: number,
  dados: Partial<NovoFornecedor>
): Promise<Fornecedor> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = (await fetchFornecedores()) || [];
  let updatedItem: Fornecedor | null = null;
  const updated = current.map((f) => {
    if (f.id === id) {
      updatedItem = { ...f, ...dados };
      return updatedItem;
    }
    return f;
  });
  saveStoredFornecedores(updated);
  return updatedItem || ({ id, ...dados } as Fornecedor);
}

export async function deleteFornecedor(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = (await fetchFornecedores()) || [];
  const updated = current.filter((f) => f.id !== id);
  saveStoredFornecedores(updated);
}

export async function toggleStatusFornecedor(id: number): Promise<Fornecedor | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const current = (await fetchFornecedores()) || [];
  let updatedItem: Fornecedor | null = null;
  const updated = current.map((f) => {
    if (f.id === id) {
      const nextStatus = f.status === 'ativo' ? 'inativo' : 'ativo';
      updatedItem = { ...f, status: nextStatus };
      return updatedItem;
    }
    return f;
  });
  saveStoredFornecedores(updated);
  return updatedItem;
}
