export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ativo' | 'inativo' | 'ferias';
  hireDate: string;
  avatar?: string;
}
