'use client';

import { useMemo, useState } from 'react';

import { calcularCmv, CMV_INICIAL } from '../services/estoqueService';
import type { CmvValores } from '../types';

export function useCmv(initial: CmvValores = CMV_INICIAL) {
  const [valores, setValores] = useState<CmvValores>(initial);

  const resultado = useMemo(() => calcularCmv(valores), [valores]);

  const updateValor = (campo: keyof CmvValores, valor: number) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  return { valores, resultado, updateValor };
}

export type UseCmvReturn = ReturnType<typeof useCmv>;
