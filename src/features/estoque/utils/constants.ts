export const CATEGORIAS_INSUMO = [
  'Massas',
  'Frios & Laticínios',
  'Molhos',
  'Embutidos',
  'Hortifrúti',
  'Bebidas',
] as const;

export const CATEGORIAS_FORNECEDOR = [
  'Massas & Farinhas',
  'Frios & Laticínios',
  'Molhos & Conservas',
  'Embutidos & Carnes',
  'Hortifrúti & Frescos',
  'Bebidas & Adega',
  'Embalagens & Descartáveis',
  'Gás & Manutenção',
  'Outros',
] as const;

export const UNIDADES_INSUMO = ['kg', 'un', 'L', 'g'] as const;

export const FILTRO_TODAS = 'Todas';

export const CATEGORIAS_PRODUTO_PESADO = [
  'Queijos & Frios',
  'Carnes & Embutidos',
  'Massas & Bases',
  'Molhos & Recheios',
  'Vegetais & Porções',
] as const;

/** Faixa saudável de CMV para pizzarias (% sobre o faturamento) */
export const META_CMV = { min: 25, max: 30 } as const;

