const EMPTY = '—';

/** '1998-05-14' → '14/05/1998' */
export function formatDate(value: string | null | undefined): string {
  if (!value) return EMPTY;
  const [datePart] = value.split(/[T ]/);
  const [y, m, d] = datePart.split('-');
  return y && m && d ? `${d}/${m}/${y}` : value;
}

/** '08:00:00' → '08:00' */
export function formatTime(value: string | null | undefined): string {
  if (!value) return EMPTY;
  return value.slice(0, 5);
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return EMPTY;
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function orEmpty(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? EMPTY : String(value);
}
