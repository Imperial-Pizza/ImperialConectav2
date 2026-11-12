import { perfilApi, type MyProfileApiResponse } from '../apis/perfilApi';
import type { ProfileData, UpdateProfilePayload, UserProfile, DocumentItem } from '../types';

const STATUS_CONTA: Record<string, 'Ativo' | 'Bloqueado' | 'Suspenso'> = {
  active: 'Ativo',
  inactive: 'Bloqueado',
  suspended: 'Suspenso',
  pending_2fa: 'Ativo',
};

const STATUS_FUNC: Record<string, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  desligado: 'Desligado',
};

const TIPO_CONTRATACAO: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário',
  autonomo: 'Autônomo',
};

const TIPO_CONTA: Record<string, string> = {
  corrente: 'Corrente',
  poupanca: 'Poupança',
  salario: 'Conta Salário',
};

const TIPO_CHAVE_PIX: Record<string, string> = {
  cpf: 'CPF',
  email: 'E-mail',
  telefone: 'Telefone',
  aleatoria: 'Chave Aleatória',
};

const brl = (value: unknown) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const nn = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
};

/** "Segunda a Sexta (08:00 às 17:00)" → { entrada: '08:00', saida: '17:00' } */
function parseJornada(texto: string | null) {
  const match = texto?.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
  return match ? { entrada: match[1], saida: match[2] } : { entrada: null, saida: null };
}

function formatEndereco(enderecos: any[]): string | null {
  const e = enderecos?.[0];
  if (!e) return null;
  const linha1 = [e.logradouro, e.numero].filter(Boolean).join(', ');
  const compl = e.complemento ? ` - ${e.complemento}` : '';
  const linha2 = [e.bairro, [e.cidade, e.estado].filter(Boolean).join('/')].filter(Boolean).join(' • ');
  const cep = e.cep ? ` • CEP ${e.cep}` : '';
  return `${linha1}${compl}${linha2 ? ` — ${linha2}` : ''}${cep}`;
}

function formatBeneficios(rem: any): string | null {
  if (!rem) return null;
  const partes: string[] = [];
  if (Number(rem.vale_transporte) > 0) partes.push(`VT ${brl(rem.vale_transporte)}`);
  if (Number(rem.vale_alimentacao) > 0) partes.push(`VA ${brl(rem.vale_alimentacao)}`);
  if (Number(rem.vale_refeicao) > 0) partes.push(`VR ${brl(rem.vale_refeicao)}`);
  if (rem.plano_saude) partes.push(`Saúde: ${rem.plano_saude}`);
  if (rem.plano_odontologico) partes.push(`Odonto: ${rem.plano_odontologico}`);
  return partes.length ? partes.join(' • ') : null;
}

/** Converte a resposta da API KodyVera para o formato (ProfileData) que a tela de perfil consome. */
function mapToProfileData({ user, item }: MyProfileApiResponse): ProfileData {
  const banco = item.dadosBancarios;
  const conta = Array.isArray(banco) ? banco[0] : null;
  const emerg = item.contatosEmergencia?.[0];
  const remAtual = item.remuneracao?.atual ?? null;
  const jornada = parseJornada(nn(item.jornadaTrabalho));
  const cargaSemanal = Number(item.cargaHorariaSemanal) || 0;

  const documents: DocumentItem[] = (item.documentos ?? []).map((d: any) => ({
    id: Number(d.id),
    nome: `${d.tipo_documento}${d.numero ? ` — ${d.numero}` : ''}`,
    tipo: String(d.tipo_documento ?? ''),
    data_envio: String(d.created_at ?? ''),
    data_atualizacao: d.updated_at ?? undefined,
    status: 'Aprovado',
    url: d.arquivo_url ?? undefined,
  }));

  const profile: UserProfile = {
    id: null,
    user_id: user.id,

    sobrenome: null,
    nome_social: nn(item.nomeSocial),
    cpf: nn(item.cpf),
    data_nascimento: nn(item.dataNascimento),
    telefone: nn(item.telefonePessoal) ?? nn(item.telefoneCorporativo),
    email_corporativo: nn(item.emailCorporativo),
    email_pessoal: nn(item.emailPessoal) ?? nn(user.email),
    endereco: formatEndereco(item.enderecos),
    endereco_detalhes: item.enderecos?.[0] ? {
      cep: nn(item.enderecos[0].cep),
      logradouro: nn(item.enderecos[0].logradouro),
      numero: nn(item.enderecos[0].numero),
      complemento: nn(item.enderecos[0].complemento),
      bairro: nn(item.enderecos[0].bairro),
      cidade: nn(item.enderecos[0].cidade),
      estado: nn(item.enderecos[0].estado),
    } : null,

    contato_emergencia_nome: nn(emerg?.nome),
    contato_emergencia_telefone: nn(emerg?.telefone_principal),
    contato_emergencia_parentesco: nn(emerg?.parentesco),

    status_funcionario: STATUS_FUNC[item.status] ?? item.status,
    supervisor_nome: null,
    tipo_contratacao: TIPO_CONTRATACAO[item.tipoContratacao] ?? nn(item.tipoContratacao),
    funcao_principal: nn(item.cargo),
    funcoes_secundarias: null,
    data_admissao: nn(item.dataAdmissao),
    data_desligamento: nn(item.dataDesligamento),
    salario_base: remAtual ? brl(remAtual.salario_base) : null,
    beneficios: formatBeneficios(remAtual),
    observacoes_contrato: null,

    disponibilidade: nn(item.regimeTrabalho),
    dias_trabalhados: null,
    dia_folga: null,
    horario_entrada: jornada.entrada,
    horario_saida: jornada.saida,
    jornada_horas: cargaSemanal ? Number((cargaSemanal / 5).toFixed(1)) : null,
    tempo_descanso_min: null,

    chave_pix: nn(conta?.chave_pix),
    tipo_chave_pix: conta?.tipo_chave_pix ? TIPO_CHAVE_PIX[conta.tipo_chave_pix] ?? conta.tipo_chave_pix : null,
    valor_diaria: null,
    tipo_pagamento: remAtual?.tipo_remuneracao ? String(remAtual.tipo_remuneracao) : null,
    periodicidade_pagamento: null,
    nome_titular: nn(conta?.titular_nome),
    cpf_cnpj_titular: nn(conta?.titular_cpf),
    banco_agencia: conta ? `${conta.banco_nome} (${conta.banco_codigo}) • Ag. ${conta.agencia}` : null,
    banco_conta: conta ? `${conta.conta}${conta.digito_conta ? `-${conta.digito_conta}` : ''}` : null,
    tipo_conta: conta ? TIPO_CONTA[conta.tipo_conta] ?? conta.tipo_conta : null,

    pontos_fortes: null,
    pontos_melhoria: null,
    observacoes_gestor: null,
    ultimo_one_on_one: null,
    proximo_one_on_one: null,

    documents,

    created_at: nn(item.createdAt),
    updated_at: nn(item.updatedAt),
  };

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      sector: nn(item.departamento?.nome),
      role: user.role,
      two_factor_enabled: user.two_factor_enabled,
      status_conta: STATUS_CONTA[user.status] ?? 'Ativo',
      ultimo_acesso: user.last_login_at,
      data_criacao: user.created_at,
      ultima_alteracao_senha: user.password_updated_at,
      sessoes_ativas: user.active_sessions,
    },
    profile,
  };
}

/** Carrega usuário logado + perfil completo direto da API unificada KodyVera. */
export async function loadMyProfile(): Promise<ProfileData> {
  const response = await perfilApi.getMyProfile();
  return mapToProfileData(response);
}

/**
 * Remove campos vazios antes de enviar: o backend faz merge com `??`,
 * então omitir um campo mantém o valor atual (e evita gravar '' em DATE/TIME).
 */
function sanitizePayload(payload: UpdateProfilePayload): UpdateProfilePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  ) as UpdateProfilePayload;
}

export async function saveMyProfile(payload: Record<string, any>): Promise<ProfileData> {
  const response = await perfilApi.updateMyProfile(payload);
  return mapToProfileData(response);
}
