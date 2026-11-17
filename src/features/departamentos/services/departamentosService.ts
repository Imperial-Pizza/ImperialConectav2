import { departamentosApi } from '../apis/departamentosApi';
import type {
  Departamento,
  DepartamentoDetalhe,
  DepartamentosListResponse,
  DepartamentosStatsResponse,
} from '../types';

export async function fetchDepartamentos(params?: {
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<DepartamentosListResponse> {
  return departamentosApi.listarDepartamentos(params);
}

export async function fetchDepartamentoDetalhe(id: string): Promise<DepartamentoDetalhe> {
  const res = await departamentosApi.obterDetalhe(id);
  return res.item;
}

export async function fetchDepartamentosStats(): Promise<DepartamentosStatsResponse> {
  return departamentosApi.obterStats();
}

export function exportarDepartamentosCsv(items: Departamento[]): void {
  if (typeof window === 'undefined' || items.length === 0) return;

  const headers = [
    'Código',
    'Nome do Departamento',
    'Centro de Custo',
    'Gestor Responsável',
    'E-mail',
    'Colaboradores',
    'Descrição',
  ];

  const escapeCsv = (val: unknown) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map((d) =>
    [
      d.codigo,
      d.nome,
      d.centroCusto,
      d.gestor,
      d.email,
      d.colaboradoresCount,
      d.descricao,
    ]
      .map(escapeCsv)
      .join(';')
  );

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `departamentos-imperial-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

