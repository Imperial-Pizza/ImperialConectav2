'use client';

import { useEffect, useMemo, useState } from 'react';

import { 
  createInsumo, 
  deleteInsumo as deleteInsumoService, 
  fetchInsumos, 
  importarInsumosService,
  isEstoqueBaixo, 
  movimentarInsumo,
  updateInsumo as updateInsumoService 
} from '../services/estoqueService';
import { FILTRO_TODAS } from '../utils/constants';
import { usePollingRefresh } from './usePollingRefresh';
import { estoqueApi } from '../apis/estoqueApi';
import { useUser } from '@/components/ui/header/hooks/user';
import type { EstoqueViewMode, Insumo, InsumoStatusFilter, NovoInsumo } from '../types';

export function useEstoque() {
  const { user } = useUser();
  const currentUserName = user?.name || 'Arthur';

  const { items, setItems, isLoading, error } = usePollingRefresh(
    fetchInsumos,
    'Não foi possível carregar o estoque.',
    estoqueApi.versaoEstoque,
  );

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>(FILTRO_TODAS);
  const [statusFilter, setStatusFilter] = useState<InsumoStatusFilter>('todos');
  const [viewMode, setViewMode] = useState<EstoqueViewMode>('table');

  // Remove cache local legado — os dados vêm exclusivamente da API
  useEffect(() => {
    try {
      localStorage.removeItem('imperial_estoque_insumos_v1');
    } catch {
      // Ignora
    }
  }, []);

  const filteredItems = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase('pt-BR');

    return items.filter((item) => {
      const matchesSearch =
        !termo ||
        item.nome.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.codigo.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.categoria.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.fornecedor.toLocaleLowerCase('pt-BR').includes(termo);

      const matchesCategoria =
        categoria === FILTRO_TODAS || item.categoria === categoria;

      const isBaixo = isEstoqueBaixo(item);
      const isMediano = !isBaixo && item.min > 0 && item.qtd <= item.min * 1.3;
      const isOk = !isBaixo && !isMediano;

      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'critico' && isBaixo) ||
        (statusFilter === 'mediano' && isMediano) ||
        (statusFilter === 'ok' && isOk);

      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }, [items, search, categoria, statusFilter]);

  const metrics = useMemo(() => {
    const totalInsumos = items.length;
    const estoqueBaixo = items.filter(isEstoqueBaixo).length;
    const estoqueNormal = totalInsumos - estoqueBaixo;
    const valorTotal = items.reduce(
      (acc, item) => acc + item.qtd * item.custoUnitario,
      0
    );
    const categorias = new Set(items.map((item) => item.categoria)).size;
    const percentualAbastecimento =
      totalInsumos > 0 ? Math.round((estoqueNormal / totalInsumos) * 100) : 0;

    return {
      totalInsumos,
      estoqueBaixo,
      estoqueNormal,
      valorTotal,
      categorias,
      percentualAbastecimento,
    };
  }, [items]);

  const lowStockCount = metrics.estoqueBaixo;

  const addInsumo = async (novo: NovoInsumo) => {
    const created = await createInsumo({
      ...novo,
      criadoPor: currentUserName,
      atualizadoPor: currentUserName,
    });
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const editInsumo = async (id: number, dados: Partial<NovoInsumo>) => {
    const updated = await updateInsumoService(id, {
      ...dados,
      atualizadoPor: currentUserName,
    });
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, atualizadoPor: currentUserName } : item)),
    );
  };

  const deleteInsumo = async (id: number) => {
    await deleteInsumoService(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const importInsumos = async (novos: Insumo[]) => {
    setIsLoading(true);
    try {
      const comAuditoria = novos.map((n) => ({
        ...n,
        criadoPor: currentUserName,
        atualizadoPor: currentUserName,
      }));
      const res = await importarInsumosService(comAuditoria);
      const atualizados = await fetchInsumos();
      setItems(atualizados);
      return res;
    } catch (err) {
      console.error('Erro ao importar insumos:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const ajustarEstoque = async (id: number, delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) return;
    const resultado = await movimentarInsumo(
      id,
      delta > 0 ? 'entrada' : 'saida',
      Math.abs(Number(delta.toFixed(2))),
      'Ajuste Rápido',
    );
    const novaQtd = Number(resultado?.saldo_novo ?? resultado?.insumo?.qtd);
    if (!Number.isFinite(novaQtd)) throw new Error('A API não retornou o novo saldo do insumo.');
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, ...resultado.insumo, qtd: novaQtd, atualizadoPor: currentUserName }
          : i
      )
    );
    return novaQtd;
  };

  return {
    items,
    filteredItems,
    lowStockCount,
    metrics,
    statusFilter,
    setStatusFilter,
    apenasBaixo: statusFilter === 'critico',
    setApenasBaixo: (b: boolean) => setStatusFilter(b ? 'critico' : 'todos'),
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    viewMode,
    setViewMode,
    addInsumo,
    editInsumo,
    deleteInsumo,
    importInsumos,
    ajustarEstoque,
  };

}

export type UseEstoqueReturn = ReturnType<typeof useEstoque>;
