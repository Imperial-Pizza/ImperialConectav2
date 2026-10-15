'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createFornecedor,
  deleteFornecedor as deleteFornecedorService,
  fetchFornecedores,
  toggleStatusFornecedor as toggleStatusService,
  updateFornecedor as updateFornecedorService,
} from '../services/fornecedorService';
import { FILTRO_TODAS } from '../utils/constants';
import type { EstoqueViewMode, Fornecedor, NovoFornecedor } from '../types';

export type FornecedorStatusFilter = 'todos' | 'ativo' | 'inativo';

export function useFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>(FILTRO_TODAS);
  const [statusFilter, setStatusFilter] = useState<FornecedorStatusFilter>('todos');
  const [viewMode, setViewMode] = useState<EstoqueViewMode>('cards');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFornecedores();
      setFornecedores(data);
    } catch {
      setError('Não foi possível carregar a lista de fornecedores.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFornecedores = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase('pt-BR');

    return fornecedores.filter((item) => {
      const matchesSearch =
        !termo ||
        item.nome.toLocaleLowerCase('pt-BR').includes(termo) ||
        (item.razaoSocial && item.razaoSocial.toLocaleLowerCase('pt-BR').includes(termo)) ||
        item.cnpj.replace(/\D/g, '').includes(termo.replace(/\D/g, '')) ||
        item.contatoNome.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.email.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.telefone.replace(/\D/g, '').includes(termo.replace(/\D/g, '')) ||
        item.cidade.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.categoria.toLocaleLowerCase('pt-BR').includes(termo) ||
        (item.insumosVinculados &&
          item.insumosVinculados.some((i) => i.toLocaleLowerCase('pt-BR').includes(termo)));

      const matchesCategoria =
        categoria === FILTRO_TODAS || item.categoria === categoria;

      const matchesStatus =
        statusFilter === 'todos' || item.status === statusFilter;

      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }, [fornecedores, search, categoria, statusFilter]);

  const metrics = useMemo(() => {
    const total = fornecedores.length;
    const ativos = fornecedores.filter((f) => f.status === 'ativo').length;
    const inativos = total - ativos;
    const categorias = new Set(fornecedores.map((f) => f.categoria)).size;

    return {
      total,
      ativos,
      inativos,
      categorias,
    };
  }, [fornecedores]);

  const addFornecedor = async (novo: NovoFornecedor) => {
    const created = await createFornecedor(novo);
    setFornecedores((prev) => [created, ...prev]);
    return created;
  };

  const editFornecedor = async (id: number, dados: Partial<NovoFornecedor>) => {
    const updated = await updateFornecedorService(id, dados);
    setFornecedores((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...dados } : item))
    );
    return updated;
  };

  const deleteFornecedor = async (id: number) => {
    await deleteFornecedorService(id);
    setFornecedores((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleStatus = async (id: number) => {
    const updated = await toggleStatusService(id);
    if (updated) {
      setFornecedores((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    }
    return updated;
  };

  return {
    fornecedores,
    filteredFornecedores,
    metrics,
    isLoading,
    error,
    search,
    setSearch,
    categoria,
    setCategoria,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    addFornecedor,
    editFornecedor,
    deleteFornecedor,
    toggleStatus,
    reloadFornecedores: loadData,
  };
}

export type UseFornecedoresReturn = ReturnType<typeof useFornecedores>;
