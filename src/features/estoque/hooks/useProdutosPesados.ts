'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createProdutoPesado,
  deleteProdutoPesado as deleteProdutoPesadoService,
  fetchProdutosPesados,
  isLoteBaixo,
  updateProdutoPesado as updateProdutoPesadoService,
} from '../services/produtosPesadosService';
import { FILTRO_TODAS } from '../utils/constants';
import type { EstoqueViewMode, NovoProdutoPesado, ProdutoPesado } from '../types';

export function useProdutosPesados() {
  const [items, setItems] = useState<ProdutoPesado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>(FILTRO_TODAS);
  const [viewMode, setViewMode] = useState<EstoqueViewMode>('table');
  const [apenasBaixo, setApenasBaixo] = useState(false);

  useEffect(() => {
    let active = true;

    fetchProdutosPesados()
      .then((data) => active && setItems(data))
      .catch(() => active && setError('Não foi possível carregar os produtos pesados.'))
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
        item.lote.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.insumoOrigem.toLocaleLowerCase('pt-BR').includes(termo);

      const matchesCategoria =
        categoria === FILTRO_TODAS || item.categoria === categoria;

      const matchesBaixo = !apenasBaixo || isLoteBaixo(item);

      return matchesSearch && matchesCategoria && matchesBaixo;
    });
  }, [items, search, categoria, apenasBaixo]);

  const metrics = useMemo(() => {
    const totalItens = items.length;
    const totalPacotes = items.reduce((acc, i) => acc + i.quantidadePacotes, 0);
    const totalKg = items.reduce((acc, i) => acc + i.pesoTotalKg, 0);
    const lotesBaixos = items.filter(isLoteBaixo).length;
    const valorTotal = items.reduce(
      (acc, i) => acc + i.pesoTotalKg * i.custoPorKg,
      0
    );

    const rendimentoMedio =
      items.length > 0
        ? Number(
            (
              items.reduce((acc, i) => acc + (i.rendimentoPercentual || 100), 0) /
              items.length
            ).toFixed(1)
          )
        : 100;

    return {
      totalItens,
      totalPacotes,
      totalKg: Number(totalKg.toFixed(1)),
      lotesBaixos,
      valorTotal,
      rendimentoMedio,
    };
  }, [items]);

  const lowWeighedCount = metrics.lotesBaixos;

  const addProdutoPesado = async (novo: NovoProdutoPesado) => {
    const created = await createProdutoPesado(novo);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const editProdutoPesado = async (
    id: number,
    dados: Partial<NovoProdutoPesado>
  ) => {
    const updated = await updateProdutoPesadoService(id, dados);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  };

  const deleteProdutoPesado = async (id: number) => {
    await deleteProdutoPesadoService(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const ajustarPacotes = async (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const novaQtd = Math.max(0, item.quantidadePacotes + delta);
    const novoPesoTotal = Number((novaQtd * item.pesoUnitarioKg).toFixed(2));

    await updateProdutoPesadoService(id, {
      quantidadePacotes: novaQtd,
    });

    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              quantidadePacotes: novaQtd,
              pesoTotalKg: novoPesoTotal,
            }
          : i
      )
    );

    return { novaQtd, novoPesoTotal };
  };

  return {
    items,
    filteredItems,
    metrics,
    lowWeighedCount,
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
    addProdutoPesado,
    editProdutoPesado,
    deleteProdutoPesado,
    ajustarPacotes,
  };
}

export type UseProdutosPesadosReturn = ReturnType<typeof useProdutosPesados>;
