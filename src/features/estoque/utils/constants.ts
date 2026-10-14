export const CATEGORIAS_INSUMO = [
  'Massas',
  'Frios & Laticínios',
  'Molhos',
  'Embutidos',
  'Hortifrúti',
  'Bebidas',
] as const;

export const UNIDADES_INSUMO = ['kg', 'un', 'L', 'g'] as const;

export const FILTRO_TODAS = 'Todas';

/** Faixa saudável de CMV para pizzarias (% sobre o faturamento) */
export const META_CMV = { min: 25, max: 30 } as const;
