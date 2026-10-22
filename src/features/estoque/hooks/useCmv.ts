import { useEffect, useMemo, useState } from 'react';
import { estoqueApi } from '../apis/estoqueApi';
import {
  calcularCmv,
  CMV_INICIAL,
  CMV_PERIODOS_CONFIG,
  gerarCmvDeEstoqueReal,
} from '../services/estoqueService';
import type { CmvOrigemDados, CmvPeriodoTipo, CmvValores, Insumo } from '../types';

export function useCmv(insumos: Insumo[] = [], initial: CmvValores = CMV_INICIAL) {
  const [periodo, setPeriodo] = useState<CmvPeriodoTipo>('mensal');
  const [origem, setOrigem] = useState<CmvOrigemDados>('estoque_real');

  const [periodosValores, setPeriodosValores] = useState<Record<CmvPeriodoTipo, CmvValores>>({
    diario: { ...CMV_PERIODOS_CONFIG.diario.valoresPadrao },
    semanal: { ...CMV_PERIODOS_CONFIG.semanal.valoresPadrao },
    quinzenal: { ...CMV_PERIODOS_CONFIG.quinzenal.valoresPadrao },
    mensal: { ...initial },
    trimestral: { ...CMV_PERIODOS_CONFIG.trimestral.valoresPadrao },
    anual: { ...CMV_PERIODOS_CONFIG.anual.valoresPadrao },
  });

  // Atualiza os valores a partir do estoque real / backend sempre que houver insumos ou mudar o período
  useEffect(() => {
    let active = true;

    if (origem === 'estoque_real') {
      estoqueApi
        .apurarCmv(periodo)
        .then((dados) => {
          if (active && dados) {
            setPeriodosValores((prev) => ({
              ...prev,
              [periodo]: {
                estoqueInicial: Number(dados.estoqueInicial ?? prev[periodo].estoqueInicial),
                comprasPeriodo: Number(dados.comprasPeriodo ?? prev[periodo].comprasPeriodo),
                estoqueFinal: Number(dados.estoqueFinal ?? prev[periodo].estoqueFinal),
                faturamentoTotal: Number(dados.faturamentoTotal ?? prev[periodo].faturamentoTotal),
                origemDados: 'estoque_real',
              },
            }));
          }
        })
        .catch(() => {
          if (active && insumos.length > 0) {
            const novosValores = gerarCmvDeEstoqueReal(insumos, periodo);
            setPeriodosValores((prev) => ({
              ...prev,
              [periodo]: novosValores,
            }));
          }
        });
    }

    return () => {
      active = false;
    };
  }, [insumos, periodo, origem]);

  const valores = periodosValores[periodo];

  const resultado = useMemo(() => calcularCmv(valores), [valores]);

  const updateValor = (campo: keyof CmvValores, valor: number) => {
    setOrigem('manual');
    setPeriodosValores((prev) => ({
      ...prev,
      [periodo]: {
        ...prev[periodo],
        [campo]: valor,
        origemDados: 'manual',
      },
    }));
  };

  const puxarDoEstoqueReal = () => {
    setOrigem('estoque_real');
    estoqueApi
      .apurarCmv(periodo)
      .then((dados) => {
        if (dados) {
          setPeriodosValores((prev) => ({
            ...prev,
            [periodo]: {
              estoqueInicial: Number(dados.estoqueInicial ?? 0),
              comprasPeriodo: Number(dados.comprasPeriodo ?? 0),
              estoqueFinal: Number(dados.estoqueFinal ?? 0),
              faturamentoTotal: Number(dados.faturamentoTotal ?? 0),
              origemDados: 'estoque_real',
            },
          }));
        }
      })
      .catch(() => {
        if (insumos.length > 0) {
          const reais = gerarCmvDeEstoqueReal(insumos, periodo);
          setPeriodosValores((prev) => ({
            ...prev,
            [periodo]: { ...reais },
          }));
        }
      });
  };

  const resetValoresPadrao = () => {
    setOrigem('manual');
    setPeriodosValores((prev) => ({
      ...prev,
      [periodo]: { ...CMV_PERIODOS_CONFIG[periodo].valoresPadrao, origemDados: 'manual' },
    }));
  };

  return {
    periodo,
    setPeriodo,
    valores,
    resultado,
    origem,
    setOrigem,
    updateValor,
    puxarDoEstoqueReal,
    resetValoresPadrao,
    configPeriodo: CMV_PERIODOS_CONFIG[periodo],
  };
}

export type UseCmvReturn = ReturnType<typeof useCmv>;
