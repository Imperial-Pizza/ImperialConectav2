import { useEffect, useMemo, useState } from 'react';

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

  // Atualiza os valores a partir do estoque real sempre que houver insumos ou mudar o período, caso origem === 'estoque_real'
  useEffect(() => {
    if (insumos.length > 0 && origem === 'estoque_real') {
      const novosValores = gerarCmvDeEstoqueReal(insumos, periodo);
      setPeriodosValores((prev) => ({
        ...prev,
        [periodo]: novosValores,
      }));
    }
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
    if (insumos.length > 0) {
      const reais = gerarCmvDeEstoqueReal(insumos, periodo);
      setPeriodosValores((prev) => ({
        ...prev,
        [periodo]: { ...reais },
      }));
    }
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
