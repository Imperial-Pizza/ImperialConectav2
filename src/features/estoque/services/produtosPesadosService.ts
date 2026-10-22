import { estoqueApi } from '../apis/estoqueApi';
import type { NovoProdutoPesado, ProdutoPesado } from '../types';

/**
 * Busca produtos pesados / porcionados 100% diretamente do Banco de Dados via API REST
 */
export async function fetchProdutosPesados(): Promise<ProdutoPesado[]> {
  return estoqueApi.listarProdutosPesados();
}

/**
 * Cadastra novo lote/produto pesado no MySQL via API REST
 */
export async function createProdutoPesado(dados: NovoProdutoPesado): Promise<ProdutoPesado> {
  return estoqueApi.criarProdutoPesado(dados);
}

/**
 * Atualiza produto pesado no MySQL via API REST
 */
export async function updateProdutoPesado(
  id: number,
  dados: Partial<NovoProdutoPesado>
): Promise<ProdutoPesado> {
  return estoqueApi.atualizarProdutoPesado(id, dados);
}

/**
 * Deleta produto pesado no MySQL via API REST
 */
export async function deleteProdutoPesado(id: number): Promise<void> {
  return estoqueApi.deletarProdutoPesado(id);
}

/**
 * Ajusta a quantidade de pacotes e recalcula o peso total diretamente no banco
 */
export async function ajustarPacotesPesado(
  id: number,
  delta: number
): Promise<{ id: number; quantidadePacotes: number; pesoTotalKg: number }> {
  return estoqueApi.ajustarPacotesPesado(id, delta);
}

/**
 * Verifica se o peso total atingiu ou ficou abaixo do peso mínimo de segurança
 */
export function isLoteBaixo(item: ProdutoPesado): boolean {
  return item.pesoTotalKg <= item.pesoMinimoKg;
}
