'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchDepartamentos,
  fetchDepartamentoDetalhe,
} from '../services/departamentosService';
import type {
  Departamento,
  DepartamentoDetalhe,
  DepartamentosViewMode,
} from '../types';

const DEFAULT_PER_PAGE = 10;

export function useDepartamentos() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(DEFAULT_PER_PAGE);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<DepartamentosViewMode>('table');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado do modal de detalhes (com lista de colaboradores do setor)
  const [selectedDetail, setSelectedDetail] = useState<DepartamentoDetalhe | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Debounce da busca e reset para página 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadDepartamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDepartamentos({
        search: debouncedSearch,
        page,
        perPage,
      });
      setItems(response.items || []);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os departamentos cadastrados.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, perPage]);

  useEffect(() => {
    loadDepartamentos();
  }, [loadDepartamentos]);

  const openDetail = useCallback(async (dep: Departamento) => {
    setIsLoadingDetail(true);
    // Pré-preenche com os dados da listagem enquanto carrega a lista de colaboradores
    setSelectedDetail({ ...dep, pessoas: [] });
    try {
      const detail = await fetchDepartamentoDetalhe(dep.id);
      setSelectedDetail(detail);
    } catch {
      // Mantém os dados básicos caso o detalhe falhe
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedDetail(null);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items,
    total,
    page,
    perPage,
    totalPages,
    setPage,
    search,
    setSearch,
    viewMode,
    setViewMode,
    isLoading,
    error,
    reload: loadDepartamentos,
    selectedDetail,
    isLoadingDetail,
    openDetail,
    closeDetail,
  };
}

export type UseDepartamentosReturn = ReturnType<typeof useDepartamentos>;

