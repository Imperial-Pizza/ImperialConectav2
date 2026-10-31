// src/features/estoque/apis/estoqueApi.ts

import type {
  Fornecedor,
  Insumo,
  NovoFornecedor,
  NovoInsumo,
  NovoProdutoPesado,
  ProdutoPesado,
} from '../types';

const API_URL =
  process.env.NEXT_PUBLIC_ESTOQUE_API_URL || 'http://localhost:8010/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('imperial_token') ||
    sessionStorage.getItem('imperial_token')
  );
}

function headers(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || fallback);
  }
  const json = await response.json();
  if (json && typeof json === 'object' && 'data' in json && json.data !== undefined) {
    return json.data as T;
  }
  return json as T;
}

export const estoqueApi = {
  // ==========================================
  // 1. INSUMOS
  // ==========================================
  versaoEstoque: async (): Promise<string> => {
    const response = await fetch(`${API_URL}/estoque/versao`, { headers: headers() });
    const version = await handle<{ insumos: string; produtos_pesados: string }>(
      response,
      'Erro ao verificar atualizações do estoque',
    );
    return `${version.insumos}|${version.produtos_pesados}`;
  },

  listarInsumos: async (params?: { busca?: string; categoria?: string; status?: string }): Promise<Insumo[]> => {
    const url = new URL(`${API_URL}/insumos`);
    if (params?.busca) url.searchParams.set('busca', params.busca);
    if (params?.categoria && params.categoria !== 'todos') url.searchParams.set('categoria', params.categoria);
    if (params?.status && params.status !== 'todos') url.searchParams.set('status', params.status);

    const response = await fetch(url.toString(), { headers: headers() });
    const items = await handle<any[]>(response, 'Erro ao carregar insumos do banco de dados');
    return items.map((i) => ({
      id: Number(i.id),
      codigo: String(i.codigo || ''),
      nome: String(i.nome || ''),
      categoria: String(i.categoria || ''),
      unidade: String(i.unidade || 'kg'),
      min: Number(i.min ?? 0),
      custoUnitario: Number(i.custoUnitario ?? i.custo_unitario ?? 0),
      qtd: Number(i.qtd ?? 0),
      fornecedor: String(i.fornecedor || i.fornecedor_nome || ''),
      observacoes: i.observacoes || '',
      criadoPor: String(i.criado_por || i.criadoPor || 'Arthur'),
      atualizadoPor: String(i.atualizado_por || i.atualizadoPor || 'Arthur'),
      createdAt: String(i.created_at || i.createdAt || ''),
      updatedAt: String(i.updated_at || i.updatedAt || ''),
    }));
  },

  obterMetricasInsumos: async () => {
    const response = await fetch(`${API_URL}/insumos/metricas`, { headers: headers() });
    return handle<any>(response, 'Erro ao obter métricas de insumos');
  },

  criarInsumo: async (dados: NovoInsumo): Promise<Insumo> => {
    const payload = {
      codigo: dados.codigo,
      nome: dados.nome,
      categoria: dados.categoria,
      unidade: dados.unidade,
      min: dados.min,
      custo_unitario: dados.custoUnitario,
      qtd: dados.qtd,
      observacoes: dados.observacoes,
      criado_por: dados.criadoPor || 'Arthur',
      atualizado_por: dados.atualizadoPor || dados.criadoPor || 'Arthur',
    };
    const response = await fetch(`${API_URL}/insumos`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const i = await handle<any>(response, 'Erro ao cadastrar insumo no banco');
    return {
      id: Number(i.id),
      codigo: String(i.codigo),
      nome: String(i.nome),
      categoria: String(i.categoria),
      unidade: String(i.unidade),
      min: Number(i.min ?? 0),
      custoUnitario: Number(i.custoUnitario ?? i.custo_unitario ?? 0),
      qtd: Number(i.qtd ?? 0),
      fornecedor: String(i.fornecedor || i.fornecedor_nome || ''),
      observacoes: i.observacoes || '',
      criadoPor: String(i.criado_por || i.criadoPor || 'Arthur'),
      atualizadoPor: String(i.atualizado_por || i.atualizadoPor || 'Arthur'),
      createdAt: String(i.created_at || i.createdAt || ''),
      updatedAt: String(i.updated_at || i.updatedAt || ''),
    };
  },

  importarInsumos: async (
    insumos: any[]
  ): Promise<{ total: number; importados: number; atualizados: number }> => {
    const payload = {
      insumos: insumos.map((item) => ({
        codigo: item.codigo,
        nome: item.nome,
        categoria: item.categoria,
        unidade: item.unidade,
        min: Number(item.min ?? 0),
        custo_unitario: Number(item.custoUnitario ?? item.custo_unitario ?? 0),
        qtd: Number(item.qtd ?? 0),
        fornecedor: item.fornecedor || item.fornecedor_nome || undefined,
        fornecedor_id: item.fornecedor_id ?? item.fornecedorId ?? undefined,
        observacoes: item.observacoes,
        criado_por: item.criadoPor || item.criado_por || 'Arthur',
        atualizado_por: item.atualizadoPor || item.atualizado_por || 'Arthur',
      })),
    };

    const response = await fetch(`${API_URL}/insumos/importar`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    return handle<{ total: number; importados: number; atualizados: number }>(
      response,
      'Erro ao importar insumos para o banco de dados'
    );
  },

  atualizarInsumo: async (id: number, dados: Partial<NovoInsumo>): Promise<Insumo> => {
    const payload: any = { ...dados };
    if (dados.custoUnitario !== undefined) {
      payload.custo_unitario = dados.custoUnitario;
    }
    if (dados.atualizadoPor !== undefined) {
      payload.atualizado_por = dados.atualizadoPor;
    }
    const response = await fetch(`${API_URL}/insumos/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const i = await handle<any>(response, 'Erro ao atualizar insumo');
    return {
      id: Number(i.id),
      codigo: String(i.codigo),
      nome: String(i.nome),
      categoria: String(i.categoria),
      unidade: String(i.unidade),
      min: Number(i.min ?? 0),
      custoUnitario: Number(i.custoUnitario ?? i.custo_unitario ?? 0),
      qtd: Number(i.qtd ?? 0),
      fornecedor: String(i.fornecedor || i.fornecedor_nome || ''),
      observacoes: i.observacoes || '',
      criadoPor: String(i.criado_por || i.criadoPor || 'Arthur'),
      atualizadoPor: String(i.atualizado_por || i.atualizadoPor || 'Arthur'),
      createdAt: String(i.created_at || i.createdAt || ''),
      updatedAt: String(i.updated_at || i.updatedAt || ''),
    };
  },

  deletarInsumo: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/insumos/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    await handle<void>(response, 'Erro ao deletar insumo do banco');
  },

  registrarMovimentacao: async (
    id: number,
    tipo: 'entrada' | 'saida',
    quantidade: number,
    motivo?: string
  ): Promise<any> => {
    const response = await fetch(`${API_URL}/insumos/${id}/movimentacao`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ tipo, quantidade, motivo }),
    });
    return handle<any>(response, 'Erro ao registrar movimentação');
  },

  // ==========================================
  // 2. PRODUTOS PESADOS / PORCIONADOS
  // ==========================================
  listarProdutosPesados: async (params?: { busca?: string; categoria?: string; alerta?: string }): Promise<ProdutoPesado[]> => {
    const url = new URL(`${API_URL}/produtos-pesados`);
    if (params?.busca) url.searchParams.set('busca', params.busca);
    if (params?.categoria && params.categoria !== 'todos') url.searchParams.set('categoria', params.categoria);
    if (params?.alerta) url.searchParams.set('alerta', params.alerta);

    const response = await fetch(url.toString(), { headers: headers() });
    const items = await handle<any[]>(response, 'Erro ao carregar produtos pesados do banco');
    return items.map((p) => ({
      id: Number(p.id),
      codigo: String(p.codigo || ''),
      nome: String(p.nome || ''),
      categoria: String(p.categoria || ''),
      insumoOrigem: String(p.insumoOrigem || p.insumo_origem || ''),
      pesoUnitarioKg: Number(p.pesoUnitarioKg ?? p.peso_unitario_kg ?? 0),
      quantidadePacotes: Number(p.quantidadePacotes ?? p.quantidade_pacotes ?? 0),
      pesoTotalKg: Number(p.pesoTotalKg ?? p.peso_total_kg ?? 0),
      pesoMinimoKg: Number(p.pesoMinimoKg ?? p.peso_minimo_kg ?? 0),
      custoPorKg: Number(p.custoPorKg ?? p.custo_por_kg ?? 0),
      dataPesagem: String(p.dataPesagem || p.data_pesagem || ''),
      dataValidade: String(p.dataValidade || p.data_validade || ''),
      lote: String(p.lote || ''),
      temperatura: String(p.temperatura || ''),
      rendimentoPercentual: Number(p.rendimentoPercentual ?? p.rendimento_percentual ?? 100),
      responsavel: String(p.responsavel || ''),
      observacoes: p.observacoes || '',
    }));
  },

  criarProdutoPesado: async (dados: NovoProdutoPesado): Promise<ProdutoPesado> => {
    const payload = {
      codigo: dados.codigo,
      nome: dados.nome,
      categoria: dados.categoria,
      insumo_origem: dados.insumoOrigem,
      peso_unitario_kg: dados.pesoUnitarioKg,
      quantidade_pacotes: dados.quantidadePacotes,
      peso_minimo_kg: dados.pesoMinimoKg,
      custo_por_kg: dados.custoPorKg,
      data_pesagem: dados.dataPesagem,
      data_validade: dados.dataValidade,
      lote: dados.lote,
      temperatura: dados.temperatura,
      rendimento_percentual: dados.rendimentoPercentual,
      responsavel: dados.responsavel,
      observacoes: dados.observacoes,
    };
    const response = await fetch(`${API_URL}/produtos-pesados`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const p = await handle<any>(response, 'Erro ao criar produto pesado');
    return {
      id: Number(p.id),
      codigo: String(p.codigo),
      nome: String(p.nome),
      categoria: String(p.categoria),
      insumoOrigem: String(p.insumoOrigem || p.insumo_origem || ''),
      pesoUnitarioKg: Number(p.pesoUnitarioKg ?? p.peso_unitario_kg ?? 0),
      quantidadePacotes: Number(p.quantidadePacotes ?? p.quantidade_pacotes ?? 0),
      pesoTotalKg: Number(p.pesoTotalKg ?? p.peso_total_kg ?? 0),
      pesoMinimoKg: Number(p.pesoMinimoKg ?? p.peso_minimo_kg ?? 0),
      custoPorKg: Number(p.custoPorKg ?? p.custo_por_kg ?? 0),
      dataPesagem: String(p.dataPesagem || p.data_pesagem || ''),
      dataValidade: String(p.dataValidade || p.data_validade || ''),
      lote: String(p.lote || ''),
      temperatura: String(p.temperatura || ''),
      rendimentoPercentual: Number(p.rendimentoPercentual ?? p.rendimento_percentual ?? 100),
      responsavel: String(p.responsavel || ''),
      observacoes: p.observacoes || '',
    };
  },

  atualizarProdutoPesado: async (id: number, dados: Partial<NovoProdutoPesado>): Promise<ProdutoPesado> => {
    const payload: any = {};
    if (dados.codigo !== undefined) payload.codigo = dados.codigo;
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.categoria !== undefined) payload.categoria = dados.categoria;
    if (dados.insumoOrigem !== undefined) payload.insumo_origem = dados.insumoOrigem;
    if (dados.pesoUnitarioKg !== undefined) payload.peso_unitario_kg = dados.pesoUnitarioKg;
    if (dados.quantidadePacotes !== undefined) payload.quantidade_pacotes = dados.quantidadePacotes;
    if (dados.pesoMinimoKg !== undefined) payload.peso_minimo_kg = dados.pesoMinimoKg;
    if (dados.custoPorKg !== undefined) payload.custo_por_kg = dados.custoPorKg;
    if (dados.dataPesagem !== undefined) payload.data_pesagem = dados.dataPesagem;
    if (dados.dataValidade !== undefined) payload.data_validade = dados.dataValidade;
    if (dados.lote !== undefined) payload.lote = dados.lote;
    if (dados.temperatura !== undefined) payload.temperatura = dados.temperatura;
    if (dados.rendimentoPercentual !== undefined) payload.rendimento_percentual = dados.rendimentoPercentual;
    if (dados.responsavel !== undefined) payload.responsavel = dados.responsavel;
    if (dados.observacoes !== undefined) payload.observacoes = dados.observacoes;

    const response = await fetch(`${API_URL}/produtos-pesados/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const p = await handle<any>(response, 'Erro ao atualizar produto pesado');
    return {
      id: Number(p.id),
      codigo: String(p.codigo),
      nome: String(p.nome),
      categoria: String(p.categoria),
      insumoOrigem: String(p.insumoOrigem || p.insumo_origem || ''),
      pesoUnitarioKg: Number(p.pesoUnitarioKg ?? p.peso_unitario_kg ?? 0),
      quantidadePacotes: Number(p.quantidadePacotes ?? p.quantidade_pacotes ?? 0),
      pesoTotalKg: Number(p.pesoTotalKg ?? p.peso_total_kg ?? 0),
      pesoMinimoKg: Number(p.pesoMinimoKg ?? p.peso_minimo_kg ?? 0),
      custoPorKg: Number(p.custoPorKg ?? p.custo_por_kg ?? 0),
      dataPesagem: String(p.dataPesagem || p.data_pesagem || ''),
      dataValidade: String(p.dataValidade || p.data_validade || ''),
      lote: String(p.lote || ''),
      temperatura: String(p.temperatura || ''),
      rendimentoPercentual: Number(p.rendimentoPercentual ?? p.rendimento_percentual ?? 100),
      responsavel: String(p.responsavel || ''),
      observacoes: p.observacoes || '',
    };
  },

  ajustarPacotesPesado: async (id: number, delta: number): Promise<{ id: number; quantidadePacotes: number; pesoTotalKg: number }> => {
    const response = await fetch(`${API_URL}/produtos-pesados/${id}/pacotes`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ delta }),
    });
    return handle(response, 'Erro ao ajustar pacotes');
  },

  deletarProdutoPesado: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/produtos-pesados/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    await handle<void>(response, 'Erro ao deletar produto pesado');
  },

  obterEtiquetaPesado: async (id: number) => {
    const response = await fetch(`${API_URL}/produtos-pesados/${id}/etiqueta`, {
      headers: headers(),
    });
    return handle<any>(response, 'Erro ao gerar etiqueta da balança');
  },

  // ==========================================
  // 3. FORNECEDORES
  // ==========================================
  listarFornecedores: async (params?: { busca?: string; categoria?: string; status?: string }): Promise<Fornecedor[]> => {
    const url = new URL(`${API_URL}/fornecedores`);
    if (params?.busca) url.searchParams.set('busca', params.busca);
    if (params?.categoria && params.categoria !== 'todos') url.searchParams.set('categoria', params.categoria);
    if (params?.status && params.status !== 'todos') url.searchParams.set('status', params.status);

    const response = await fetch(url.toString(), { headers: headers() });
    const items = await handle<any[]>(response, 'Erro ao carregar fornecedores do banco');
    return items.map((f) => ({
      id: Number(f.id),
      nome: String(f.nome || ''),
      razaoSocial: String(f.razaoSocial || f.razao_social || ''),
      cnpj: String(f.cnpj || ''),
      categoria: String(f.categoria || ''),
      contatoNome: String(f.contatoNome || f.contato_nome || ''),
      telefone: String(f.telefone || ''),
      email: String(f.email || ''),
      cidade: String(f.cidade || ''),
      estado: String(f.estado || ''),
      prazoEntrega: String(f.prazoEntrega || f.prazo_entrega || ''),
      condicaoPagamento: String(f.condicaoPagamento || f.condicao_pagamento || ''),
      status: (f.status === 'inativo' ? 'inativo' : 'ativo') as 'ativo' | 'inativo',
      insumosVinculados: Array.isArray(f.insumosVinculados)
        ? f.insumosVinculados
        : typeof f.insumos_vinculados === 'string'
        ? JSON.parse(f.insumos_vinculados || '[]')
        : [],
      observacoes: f.observacoes || '',
    }));
  },

  criarFornecedor: async (dados: NovoFornecedor): Promise<Fornecedor> => {
    const payload = {
      nome: dados.nome,
      razao_social: dados.razaoSocial,
      cnpj: dados.cnpj,
      categoria: dados.categoria,
      contato_nome: dados.contatoNome,
      telefone: dados.telefone,
      email: dados.email,
      cidade: dados.cidade,
      estado: dados.estado,
      prazo_entrega: dados.prazoEntrega,
      condicao_pagamento: dados.condicaoPagamento,
      status: dados.status || 'ativo',
      insumos_vinculados: dados.insumosVinculados || [],
      observacoes: dados.observacoes,
    };
    const response = await fetch(`${API_URL}/fornecedores`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const f = await handle<any>(response, 'Erro ao cadastrar fornecedor');
    return {
      id: Number(f.id),
      nome: String(f.nome),
      razaoSocial: String(f.razaoSocial || f.razao_social || ''),
      cnpj: String(f.cnpj || ''),
      categoria: String(f.categoria || ''),
      contatoNome: String(f.contatoNome || f.contato_nome || ''),
      telefone: String(f.telefone || ''),
      email: String(f.email || ''),
      cidade: String(f.cidade || ''),
      estado: String(f.estado || ''),
      prazoEntrega: String(f.prazoEntrega || f.prazo_entrega || ''),
      condicaoPagamento: String(f.condicaoPagamento || f.condicao_pagamento || ''),
      status: f.status || 'ativo',
      insumosVinculados: f.insumosVinculados || [],
      observacoes: f.observacoes || '',
    };
  },

  atualizarFornecedor: async (id: number, dados: Partial<NovoFornecedor>): Promise<Fornecedor> => {
    const payload: any = {};
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.razaoSocial !== undefined) payload.razao_social = dados.razaoSocial;
    if (dados.cnpj !== undefined) payload.cnpj = dados.cnpj;
    if (dados.categoria !== undefined) payload.categoria = dados.categoria;
    if (dados.contatoNome !== undefined) payload.contato_nome = dados.contatoNome;
    if (dados.telefone !== undefined) payload.telefone = dados.telefone;
    if (dados.email !== undefined) payload.email = dados.email;
    if (dados.cidade !== undefined) payload.cidade = dados.cidade;
    if (dados.estado !== undefined) payload.estado = dados.estado;
    if (dados.prazoEntrega !== undefined) payload.prazo_entrega = dados.prazoEntrega;
    if (dados.condicaoPagamento !== undefined) payload.condicao_pagamento = dados.condicaoPagamento;
    if (dados.status !== undefined) payload.status = dados.status;
    if (dados.insumosVinculados !== undefined) payload.insumos_vinculados = dados.insumosVinculados;
    if (dados.observacoes !== undefined) payload.observacoes = dados.observacoes;

    const response = await fetch(`${API_URL}/fornecedores/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const f = await handle<any>(response, 'Erro ao atualizar fornecedor');
    return {
      id: Number(f.id),
      nome: String(f.nome),
      razaoSocial: String(f.razaoSocial || f.razao_social || ''),
      cnpj: String(f.cnpj || ''),
      categoria: String(f.categoria || ''),
      contatoNome: String(f.contatoNome || f.contato_nome || ''),
      telefone: String(f.telefone || ''),
      email: String(f.email || ''),
      cidade: String(f.cidade || ''),
      estado: String(f.estado || ''),
      prazoEntrega: String(f.prazoEntrega || f.prazo_entrega || ''),
      condicaoPagamento: String(f.condicaoPagamento || f.condicao_pagamento || ''),
      status: f.status || 'ativo',
      insumosVinculados: f.insumosVinculados || [],
      observacoes: f.observacoes || '',
    };
  },

  deletarFornecedor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/fornecedores/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    await handle<void>(response, 'Erro ao deletar fornecedor');
  },

  // ==========================================
  // 4. BALANÇO FÍSICO DE ESTOQUE
  // ==========================================
  prepararBalanco: async () => {
    const response = await fetch(`${API_URL}/balanco/preparar`, { headers: headers() });
    return handle<any>(response, 'Erro ao preparar lista de balanço físico');
  },

  finalizarBalanco: async (dados: {
    responsavel: string;
    itens: { insumoId: number; qtdFisica: number; motivo?: string }[];
  }) => {
    const payload = {
      responsavel: dados.responsavel,
      itens: dados.itens.map((i) => ({
        insumo_id: i.insumoId,
        qtd_fisica: i.qtdFisica,
        motivo: i.motivo,
      })),
    };
    const response = await fetch(`${API_URL}/balanco/finalizar`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    return handle<any>(response, 'Erro ao finalizar e salvar balanço físico no banco');
  },

  listarHistoricoBalanco: async () => {
    const response = await fetch(`${API_URL}/balanco/historico`, { headers: headers() });
    return handle<any[]>(response, 'Erro ao buscar histórico de balanços');
  },

  // ==========================================
  // 5. CMV OPERACIONAL
  // ==========================================
  apurarCmv: async (periodo: string = 'mensal') => {
    const response = await fetch(`${API_URL}/cmv/apuracao?periodo=${periodo}`, {
      headers: headers(),
    });
    return handle<any>(response, 'Erro ao apurar CMV do banco');
  },

  fecharCmv: async (dados: {
    periodo: string;
    estoqueInicial: number;
    comprasPeriodo: number;
    estoqueFinal: number;
    faturamentoTotal: number;
    responsavel: string;
  }) => {
    const payload = {
      periodo: dados.periodo,
      estoque_inicial: dados.estoqueInicial,
      compras_periodo: dados.comprasPeriodo,
      estoque_final: dados.estoqueFinal,
      faturamento_total: dados.faturamentoTotal,
      responsavel: dados.responsavel,
    };
    const response = await fetch(`${API_URL}/cmv/fechamento`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    return handle<any>(response, 'Erro ao registrar fechamento de CMV no banco');
  },

  listarHistoricoCmv: async () => {
    const response = await fetch(`${API_URL}/cmv/historico`, { headers: headers() });
    return handle<any[]>(response, 'Erro ao carregar histórico de CMV');
  },
};
