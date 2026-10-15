'use client';

import { useEffect, useMemo, useState } from 'react';

import { 
  createInsumo, 
  deleteInsumo as deleteInsumoService, 
  fetchInsumos, 
  isEstoqueBaixo, 
  updateInsumo as updateInsumoService 
} from '../services/estoqueService';
import { FILTRO_TODAS } from '../utils/constants';
import type { EstoqueViewMode, Insumo, NovoInsumo } from '../types';

export function useEstoque() {
  const [items, setItems] = useState<Insumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>(FILTRO_TODAS);
  const [viewMode, setViewMode] = useState<EstoqueViewMode>('table');

  const [apenasBaixo, setApenasBaixo] = useState(false);

  useEffect(() => {
    let active = true;

    fetchInsumos()
      .then((data) => active && setItems(data))
      .catch(() => active && setError('Não foi possível carregar o estoque.'))
      .finally(() => active && setIsLoading(false));

    return () => {
      active = false;
    };
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

      const matchesBaixo = !apenasBaixo || isEstoqueBaixo(item);

      return matchesSearch && matchesCategoria && matchesBaixo;
    });
  }, [items, search, categoria, apenasBaixo]);

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
      totalInsumos > 0 ? Math.round((estoqueNormal / totalInsumos) * 100) : 100;

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
    const created = await createInsumo(novo);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const editInsumo = async (id: number, dados: Partial<NovoInsumo>) => {
    await updateInsumoService(id, dados);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...dados } : item)),
    );
  };

  const deleteInsumo = async (id: number) => {
    await deleteInsumoService(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const importInsumos = (novos: Insumo[]) => {
    setItems((prev) => [...novos, ...prev]);
  };

  return {
    items,
    filteredItems,
    lowStockCount,
    metrics,
    apenasBaixo,
    setApenasBaixo,
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
  };
}

export type UseEstoqueReturn = ReturnType<typeof useEstoque>;
