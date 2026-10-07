// Tipos espelhando o retorno de GET /api/users/{id}/profile (AuthImperial)

export interface ProfileUser {
  id: number;
  name: string;
  email: string;
  sector: string | null;
  role: string;
  two_factor_enabled: boolean;
}

export type TipoContratacao = 'Fixo' | 'Diarista' | 'Temporario';
export type TipoConta = 'Corrente' | 'Poupança' | 'PIX';

export interface UserProfile {
  id: number | null;
  user_id: number;
  sobrenome: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  data_admissao: string | null;
  data_desligamento: string | null;
  contato_emergencia_nome: string | null;
  contato_emergencia_telefone: string | null;
  contato_emergencia_parentesco: string | null;
  tipo_contratacao: TipoContratacao | string | null;
  funcao_principal: string | null;
  funcoes_secundarias: string | null;
  disponibilidade: string | null;
  dias_trabalhados: string | null;
  dia_folga: string | null;
  horario_entrada: string | null;
  horario_saida: string | null;
  jornada_horas: number | string | null;
  tempo_descanso_min: number | null;
  chave_pix: string | null;
  valor_diaria: number | string | null;
  nome_titular: string | null;
  cpf_cnpj_titular: string | null;
  banco_agencia: string | null;
  banco_conta: string | null;
  tipo_conta: TipoConta | string | null;
  pontos_fortes: string | null;
  pontos_melhoria: string | null;
  observacoes_gestor: string | null;
  ultimo_one_on_one: string | null;
  proximo_one_on_one: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileData {
  user: ProfileUser;
  profile: UserProfile | null;
}

/** Campos aceitos pelo PUT /api/users/{id}/profile (todos opcionais). */
export type UpdateProfilePayload = Partial<
  Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

export interface UpdateProfileResponse {
  message: string;
  profile: UserProfile | null;
}

export type ProfileTab = 'pessoal' | 'contrato' | 'financeiro' | 'feedback';
