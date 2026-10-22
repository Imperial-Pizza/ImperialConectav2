'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { estoqueApi } from '../apis/estoqueApi';
import type {
  FiltroBalancoStatus,
  HistoricoBalanco,
  HistoricoBalancoItem,
  Insumo,
  ItemBalanco,
  StatusDivergencia,
} from '../types';
import { FILTRO_TODAS } from '../utils/constants';

const STORAGE_KEY_HISTORICO = 'imperial_estoque_balanco_historico_v1';

export function useBalanco(
  items: Insumo[],
  aplicarBalancoEstoque: (ajustes: { id: number; novaQtd: number }[]) => Promise<void>
) {
  // Guarda a contagem física digitada pelo usuário para cada insumo (id -> qtd ou null)
  const [contagens, setContagens] = useState<Record<number, number | null>>({});

  // Guarda o motivo da divergência selecionado pelo usuário (id -> texto)
  const [motivos, setMotivos] = useState<Record<number, string>>({});

  // Filtros
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string>(FILTRO_TODAS);
  const [statusFilter, setStatusFilter] = useState<FiltroBalancoStatus>('todos');

  // Histórico salvo
  const [historico, setHistorico] = useState<HistoricoBalanco[]>([]);

  // Carrega histórico da API (MySQL) ou do localStorage na montagem
  useEffect(() => {
    estoqueApi
      .listarHistoricoBalanco()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistorico(data);
        } else {
          const saved = localStorage.getItem(STORAGE_KEY_HISTORICO);
          if (saved) setHistorico(JSON.parse(saved));
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY_HISTORICO);
          if (saved) {
            setHistorico(JSON.parse(saved));
          }
        } catch {
          // Ignora erro de parsing no SSR/localStorage
        }
      });
  }, []);

  // Mapeia insumos para itens de balanço com cálculos instantâneos
  const itensBalanco = useMemo<ItemBalanco[]>(() => {
    return items.map((item) => {
      const qtdFisica = contagens[item.id] !== undefined ? contagens[item.id] : null;
      const qtdSistema = item.qtd;

      let divergenciaQtd = 0;
      let divergenciaValor = 0;
      let status: StatusDivergencia = 'pendente';

      if (qtdFisica !== null) {
        divergenciaQtd = Number((qtdFisica - qtdSistema).toFixed(2));
        divergenciaValor = Number((divergenciaQtd * item.custoUnitario).toFixed(2));

        if (divergenciaQtd === 0) {
          status = 'bateu';
        } else if (divergenciaQtd < 0) {
          status = 'falta';
        } else {
          status = 'sobra';
        }
      }

      return {
        insumoId: item.id,
        codigo: item.codigo,
        nome: item.nome,
        categoria: item.categoria,
        unidade: item.unidade,
        custoUnitario: item.custoUnitario,
        qtdSistema,
        qtdFisica,
        divergenciaQtd,
        divergenciaValor,
        motivo: motivos[item.id] || '',
        status,
      };
    });
  }, [items, contagens, motivos]);

  // Itens filtrados por busca, categoria e status
  const filteredItens = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase('pt-BR');

    return itensBalanco.filter((item) => {
      const matchesSearch =
        !termo ||
        item.nome.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.codigo.toLocaleLowerCase('pt-BR').includes(termo) ||
        item.categoria.toLocaleLowerCase('pt-BR').includes(termo);

      const matchesCategoria =
        categoria === FILTRO_TODAS || item.categoria === categoria;

      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'divergentes' && (item.status === 'falta' || item.status === 'sobra')) ||
        (statusFilter === 'bateu' && item.status === 'bateu') ||
        (statusFilter === 'pendentes' && item.status === 'pendente');

      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }, [itensBalanco, search, categoria, statusFilter]);

  // Métricas do Balanço
  const metrics = useMemo(() => {
    const totalItens = itensBalanco.length;
    const contados = itensBalanco.filter((i) => i.qtdFisica !== null);
    const contadosCount = contados.length;
    const pendentesCount = totalItens - contadosCount;

    const bateuCount = contados.filter((i) => i.status === 'bateu').length;
    const divergentesCount = contados.filter(
      (i) => i.status === 'falta' || i.status === 'sobra'
    ).length;

    const totalPerdas = contados
      .filter((i) => i.status === 'falta')
      .reduce((acc, i) => acc + Math.abs(i.divergenciaValor), 0);

    const totalSobras = contados
      .filter((i) => i.status === 'sobra')
      .reduce((acc, i) => acc + i.divergenciaValor, 0);

    const impactoLiquido = totalSobras - totalPerdas;

    const percentualProgresso =
      totalItens > 0 ? Math.round((contadosCount / totalItens) * 100) : 0;

    const percentualAcuracia =
      contadosCount > 0 ? Math.round((bateuCount / contadosCount) * 100) : 100;

    return {
      totalItens,
      contadosCount,
      pendentesCount,
      divergentesCount,
      bateuCount,
      totalPerdas,
      totalSobras,
      impactoLiquido,
      percentualProgresso,
      percentualAcuracia,
    };
  }, [itensBalanco]);

  // Ações de alteração de contagem
  const setContagem = useCallback((id: number, valor: number | null) => {
    setContagens((prev) => ({
      ...prev,
      [id]: valor !== null ? Math.max(0, Number(valor.toFixed(2))) : null,
    }));
  }, []);

  const ajustarContagem = useCallback((id: number, delta: number) => {
    setContagens((prev) => {
      const atual = prev[id] !== undefined && prev[id] !== null ? prev[id]! : 0;
      const novo = Math.max(0, Number((atual + delta).toFixed(2)));
      return { ...prev, [id]: novo };
    });
  }, []);

  const marcarBateu = useCallback(
    (id: number) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        setContagens((prev) => ({ ...prev, [id]: item.qtd }));
      }
    },
    [items]
  );

  const setMotivo = useCallback((id: number, motivo: string) => {
    setMotivos((prev) => ({ ...prev, [id]: motivo }));
  }, []);

  // Preenche todos os insumos não contados com o saldo do sistema
  const preencherTodosComSaldoAtual = useCallback(() => {
    const novos: Record<number, number> = {};
    items.forEach((item) => {
      novos[item.id] = item.qtd;
    });
    setContagens(novos);
  }, [items]);

  // Limpa a contagem atual
  const limparContagem = useCallback(() => {
    setContagens({});
    setMotivos({});
  }, []);

  // Finalizar e sincronizar com o estoque e banco de dados
  const finalizarBalanco = useCallback(
    async (responsavel: string) => {
      const itensContados = itensBalanco.filter((i) => i.qtdFisica !== null);
      if (itensContados.length === 0) {
        throw new Error('Nenhum item foi contado.');
      }

      // Aplica as novas quantidades físicas no estoque
      const ajustesParaEstoque = itensContados.map((i) => ({
        id: i.insumoId,
        novaQtd: i.qtdFisica!,
      }));

      await aplicarBalancoEstoque(ajustesParaEstoque);

      // Salva no banco de dados através da API
      try {
        await estoqueApi.finalizarBalanco({
          responsavel: responsavel.trim() || 'Equipe de Estoque',
          itens: itensContados.map((i) => ({
            insumoId: i.insumoId,
            qtdFisica: i.qtdFisica!,
            motivo: i.motivo,
          })),
        });
      } catch (err) {
        console.warn('Erro ao registrar balanço no backend remoto:', err);
      }

      // Registra no histórico local
      const historicoItens: HistoricoBalancoItem[] = itensContados.map((i) => ({
        codigo: i.codigo,
        nome: i.nome,
        unidade: i.unidade,
        qtdSistema: i.qtdSistema,
        qtdFisica: i.qtdFisica!,
        divergenciaQtd: i.divergenciaQtd,
        divergenciaValor: i.divergenciaValor,
        motivo: i.motivo,
      }));

      const novoHistorico: HistoricoBalanco = {
        id: `BAL-${Date.now()}`,
        dataHora: new Date().toISOString(),
        responsavel: responsavel.trim() || 'Equipe de Estoque',
        totalItensContados: itensContados.length,
        totalItensDivergentes: metrics.divergentesCount,
        impactoFinanceiroTotal: metrics.impactoLiquido,
        totalPerdas: metrics.totalPerdas,
        totalSobras: metrics.totalSobras,
        itens: historicoItens,
      };

      const atualizado = [novoHistorico, ...historico];
      setHistorico(atualizado);

      try {
        localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(atualizado));
      } catch {
        // Ignora
      }

      // Reseta contagem após o fechamento
      limparContagem();

      return novoHistorico;
    },
    [itensBalanco, aplicarBalancoEstoque, metrics, historico, limparContagem]
  );

  return {
    itensBalanco,
    filteredItens,
    metrics,
    search,
    setSearch,
    categoria,
    setCategoria,
    statusFilter,
    setStatusFilter,
    contagens,
    motivos,
    historico,
    setContagem,
    ajustarContagem,
    marcarBateu,
    setMotivo,
    preencherTodosComSaldoAtual,
    limparContagem,
    finalizarBalanco,
  };
}

export type UseBalancoReturn = ReturnType<typeof useBalanco>;
