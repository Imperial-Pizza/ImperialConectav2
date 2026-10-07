// Tipos espelhando o retorno de GET /api/users/{id}/profile (AuthImperial)

export interface ProfileUser {
  id: number;
  name: string;
  email: string;
  sector: string | null;
  role: string;
  two_factor_enabled: boolean;
  
  // Novos campos de Segurança
  status_conta?: 'Ativo' | 'Bloqueado' | 'Suspenso';
  ultimo_acesso?: string | null;
  data_criacao?: string | null;
  ultima_alteracao_senha?: string | null;
  sessoes_ativas?: number;
}

export type TipoContratacao = 'Fixo' | 'Diarista' | 'Temporario';
export type TipoConta = 'Corrente' | 'Poupança' | 'PIX';
export type StatusFuncionario = 'Ativo' | 'Férias' | 'Afastado' | 'Desligado';

// --- Entidades Relacionais ---

export interface ContractHistoryItem {
  id: number;
  data: string;
  evento: string; // Ex: 'Admissão', 'Alteração salarial'
  detalhes?: string;
}

export interface PaymentHistoryItem {
  id: number;
  data: string;
  periodo: string; // Ex: 'Outubro/2026'
  quantidade_diarias?: number;
  valor: string; // Formatado ou numérico
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

export interface AttendanceHistoryItem {
  id: number;
  data: string;
  horario_entrada?: string;
  horario_saida?: string;
  horas_trabalhadas?: string;
  status: 'Trabalhado' | 'Falta' | 'Atraso';
}

export interface EvaluationItem {
  id: number;
  data: string;
  nota: number | string;
  avaliador: string;
  status: string;
  observacoes?: string;
}

export interface OneOnOneItem {
  id: number;
  data: string;
  responsavel: string;
  assunto: string;
  resumo?: string;
  pontos_discutidos?: string;
  proximos_passos?: string;
  observacoes?: string;
}

export interface DocumentItem {
  id: number;
  nome: string;
  tipo: string; // Ex: 'RG', 'Contrato'
  data_envio: string;
  data_atualizacao?: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
  url?: string;
}

export interface AuditLogItem {
  id: number;
  data: string;
  responsavel: string;
  acao: string; // Ex: 'Alterou Valor da diária'
  valor_anterior?: string;
  valor_novo?: string;
}

// ----------------------------------

export interface UserProfile {
  id: number | null;
  user_id: number;
  
  // Pessoal
  sobrenome: string | null;
  nome_social?: string | null;
  cpf?: string | null;
  rg?: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  email_corporativo?: string | null;
  endereco?: string | null;
  
  // Emergência
  contato_emergencia_nome: string | null;
  contato_emergencia_telefone: string | null;
  contato_emergencia_parentesco: string | null;
  
  // Contrato & Status
  status_funcionario?: StatusFuncionario | string;
  supervisor_nome?: string | null;
  tipo_contratacao: TipoContratacao | string | null;
  funcao_principal: string | null;
  funcoes_secundarias: string | null;
  data_admissao: string | null;
  data_desligamento: string | null;
  salario_base?: string | null;
  beneficios?: string | null;
  observacoes_contrato?: string | null;
  
  // Jornada de Trabalho (Geral)
  disponibilidade: string | null;
  dias_trabalhados: string | null;
  dia_folga: string | null;
  horario_entrada: string | null;
  horario_saida: string | null;
  jornada_horas: number | string | null;
  tempo_descanso_min: number | null;
  
  // Jornada (Semanal Detalhada - Opcional)
  jornada_segunda?: string | null;
  jornada_terca?: string | null;
  jornada_quarta?: string | null;
  jornada_quinta?: string | null;
  jornada_sexta?: string | null;
  jornada_sabado?: string | null;
  jornada_domingo?: string | null;
  
  // Financeiro & PIX
  chave_pix: string | null;
  tipo_chave_pix?: string | null;
  valor_diaria: number | string | null;
  tipo_pagamento?: string | null;
  periodicidade_pagamento?: string | null;
  nome_titular: string | null;
  cpf_cnpj_titular: string | null;
  banco_agencia: string | null;
  banco_conta: string | null;
  tipo_conta: TipoConta | string | null;
  
  // Avaliação & Feedback (Campos legados)
  pontos_fortes: string | null;
  pontos_melhoria: string | null;
  observacoes_gestor: string | null;
  ultimo_one_on_one: string | null;
  proximo_one_on_one: string | null;
  
  // Relacionamentos Estruturados (Listas Opcionais para compatibilidade)
  contract_history?: ContractHistoryItem[];
  payments_history?: PaymentHistoryItem[];
  attendance_history?: AttendanceHistoryItem[];
  evaluations?: EvaluationItem[];
  one_on_ones?: OneOnOneItem[];
  documents?: DocumentItem[];
  audit_logs?: AuditLogItem[];
  
  // Timestamps
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileData {
  user: ProfileUser;
  profile: UserProfile | null;
}

/** Campos aceitos pelo PUT /api/users/{id}/profile (todos opcionais). */
export type UpdateProfilePayload = Partial<
  Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'contract_history' | 'payments_history' | 'attendance_history' | 'evaluations' | 'one_on_ones' | 'documents' | 'audit_logs'>
>;

export interface UpdateProfileResponse {
  message: string;
  profile: UserProfile | null;
}

export type ProfileTab = 'pessoal' | 'seguranca' | 'contrato' | 'financeiro' | 'frequencia' | 'feedback' | '1on1' | 'documentos' | 'historico';
