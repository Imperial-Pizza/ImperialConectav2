export type DepartamentosViewMode = 'table' | 'cards';

export interface Departamento {
  id: string;
  nome: string;
  codigo: string;
  centroCusto: string;
  gestor: string;
  email: string;
  descricao: string;
  colaboradoresCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartamentoColaborador {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  avatar: string;
  hasUser: boolean;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface DepartamentoDetalhe extends Departamento {
  pessoas: DepartamentoColaborador[];
}

export interface DepartamentosListResponse {
  success: boolean;
  message: string;
  page: number;
  perPage: number;
  total: number;
  items: Departamento[];
}

export interface DepartamentoDetailResponse {
  success: boolean;
  message: string;
  item: DepartamentoDetalhe;
}

export interface DepartamentosStatsResponse {
  success: boolean;
  message: string;
  totalDepartamentos: number;
  totalColaboradores: number;
}

