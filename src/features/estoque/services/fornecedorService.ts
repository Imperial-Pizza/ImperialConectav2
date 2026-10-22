import { estoqueApi } from '../apis/estoqueApi';
import type { Fornecedor, NovoFornecedor } from '../types';

/**
 * Busca lista de fornecedores 100% diretamente do Banco de Dados via API REST
 */
export async function fetchFornecedores(): Promise<Fornecedor[]> {
  return estoqueApi.listarFornecedores();
}

/**
 * Cadastra fornecedor no MySQL via API REST
 */
export async function createFornecedor(novo: NovoFornecedor): Promise<Fornecedor> {
  return estoqueApi.criarFornecedor(novo);
}

/**
 * Atualiza fornecedor no MySQL via API REST
 */
export async function updateFornecedor(
  id: number,
  dados: Partial<NovoFornecedor>
): Promise<Fornecedor> {
  return estoqueApi.atualizarFornecedor(id, dados);
}

/**
 * Deleta fornecedor no MySQL via API REST
 */
export async function deleteFornecedor(id: number): Promise<void> {
  return estoqueApi.deletarFornecedor(id);
}

/**
 * Alterna status ativo/inativo do fornecedor
 */
export async function toggleStatusFornecedor(id: number): Promise<Fornecedor | null> {
  const currentList = await estoqueApi.listarFornecedores();
  const current = currentList.find((f) => f.id === id);
  if (!current) return null;
  const nextStatus = current.status === 'ativo' ? 'inativo' : 'ativo';
  return estoqueApi.atualizarFornecedor(id, { status: nextStatus });
}
