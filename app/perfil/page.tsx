'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/layouts/AppShell';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { usePerfil } from '@/features/perfil/hooks/usePerfil';
import { ProfileTab } from '@/features/perfil/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Briefcase, 
  CreditCard, 
  HeartHandshake, 
  Shield, 
  Key, 
  Phone, 
  Clock, 
  Loader2,
  Calendar,
  FileText,
  History,
  Activity,
  Smartphone,
  MapPin,
  Mail,
  Download,
  Eye,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Não informado';
  if (dateString.includes('/')) return dateString;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR');
};



export default function PerfilPage() {
  const { data: apiData, isLoading, error } = usePerfil();
  
  const [profileTab, setProfileTab] = useState<ProfileTab>('pessoal');


  if (isLoading) {
    return (
      <AppShell activeModule="perfil">
        <div className="flex h-full items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      </AppShell>
    );
  }

  if (!apiData) {
    return (
      <AppShell activeModule="perfil">
        <div className="text-center text-slate-500 py-10">
          Erro ao carregar os dados.
        </div>
      </AppShell>
    );
  }

  const profile = apiData.profile;
  const user = apiData.user;

  return (
    <AppShell activeModule="perfil">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {error && (
          <StatusBanner variant="error" message={error} />
        )}



        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 min-h-[600px]">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {profile?.nome_social || user.name} {profile?.sobrenome && profile.sobrenome !== 'string' ? profile.sobrenome : ''}
                </h2>
                <p className="text-xs text-slate-500 font-medium">{profile?.funcao_principal || user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* O botão de edição foi removido daqui para focar apenas na visualização do prontuário */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              
              <div className="lg:col-span-3 space-y-2 shrink-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">Navegação do Prontuário</p>
                
                {[
                  { id: 'pessoal', icon: UserIcon, label: 'Credenciais & Pessoal' },
                  { id: 'seguranca', icon: Shield, label: 'Segurança & Acesso' },
                  { id: 'contrato', icon: Briefcase, label: 'Contrato & Jornada' },
                  { id: 'financeiro', icon: CreditCard, label: 'Financeiro & PIX' },
                  { id: 'frequencia', icon: Activity, label: 'Frequência' },
                  { id: 'feedback', icon: HeartHandshake, label: 'Avaliação & Feedback' },
                  { id: '1on1', icon: MessageSquare, label: '1:1 & Gestão' },
                  { id: 'documentos', icon: FileText, label: 'Documentos' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as ProfileTab)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                      profileTab === tab.id 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  {profileTab === 'pessoal' && (
                    <motion.div key="pessoal" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-red-600" /> Dados Cadastrais
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div><span className="text-slate-400 font-semibold block">Nome Completo</span><span className="font-bold text-slate-800">{user.name} {profile?.sobrenome || ''}</span></div>
                          <div><span className="text-slate-400 font-semibold block">Nome Social / Apelido</span><span className="font-bold text-slate-800">{profile?.nome_social || '-'}</span></div>
                          <div><span className="text-slate-400 font-semibold block">CPF</span><span className="font-bold text-slate-800">{profile?.cpf || 'Não informado'}</span></div>
                          <div><span className="text-slate-400 font-semibold block">RG</span><span className="font-bold text-slate-800">{profile?.rg || 'Não informado'}</span></div>
                          <div><span className="text-slate-400 font-semibold block">Data de Nascimento</span><span className="font-bold text-slate-800">{formatDate(profile?.data_nascimento)}</span></div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-indigo-600" /> Contato
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">E-mail Corporativo</span><span className="font-bold text-slate-800">{profile?.email_corporativo || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">E-mail Pessoal</span><span className="font-bold text-slate-800">{user.email}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Telefone Pessoal</span><span className="font-bold text-slate-800">{profile?.telefone || 'Não informado'}</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-rose-600" /> Emergência
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Nome</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_nome || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Grau de Parentesco</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_parentesco || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Telefone</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_telefone || 'Não informado'}</span></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" /> Endereço
                        </h3>
                        <div className="text-xs">
                          <span className="text-slate-400 font-semibold block">Residencial</span>
                          <span className="font-bold text-slate-800">{profile?.endereco || 'Não informado'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'seguranca' && (
                    <motion.div key="seguranca" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-600" /> Status da Conta
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Perfil de Permissão</span><span className="font-bold text-slate-800 uppercase">{user.role}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Status</span><span className="font-bold text-slate-800">{user.status_conta || 'Ativo'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Data de Criação</span><span className="font-bold text-slate-800">{formatDate(user.data_criacao) || formatDate(profile?.created_at)}</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-600" /> Credenciais
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-slate-400 font-semibold block">Autenticação de 2 Fatores (2FA)</span>
                              <span className={`font-bold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] mt-1 ${user.two_factor_enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                                {user.two_factor_enabled ? 'Ativado' : 'Desativado'}
                              </span>
                            </div>
                            <div><span className="text-slate-400 font-semibold block">Última Alteração de Senha</span><span className="font-bold text-slate-800">{formatDate(user.ultima_alteracao_senha) || 'Não informado'}</span></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'contrato' && (
                    <motion.div key="contrato" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-600" /> Vínculo Empregatício
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Tipo de Contratação</span><span className="font-bold text-slate-800">{profile?.tipo_contratacao || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Função Principal</span><span className="font-bold text-slate-800">{profile?.funcao_principal || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Supervisor / Responsável</span><span className="font-bold text-slate-800">{profile?.supervisor_nome || 'Não informado'}</span></div>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 mt-2">
                              <div><span className="text-slate-400 font-semibold block">Data de Admissão</span><span className="font-bold text-slate-800">{formatDate(profile?.data_admissao)}</span></div>
                              <div><span className="text-slate-400 font-semibold block">Data de Desligamento</span><span className="font-bold text-slate-800">{formatDate(profile?.data_desligamento) || '-'}</span></div>
                            </div>
                            <div><span className="text-slate-400 font-semibold block">Salário Base</span><span className="font-bold text-emerald-600">{profile?.salario_base || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Benefícios</span><span className="font-bold text-slate-800">{profile?.beneficios || 'Não informado'}</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" /> Jornada Prevista
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                              <div><span className="text-slate-400 font-semibold block">Carga Horária Diária</span><span className="font-bold text-slate-800">{profile?.jornada_horas || '-'}h</span></div>
                              <div><span className="text-slate-400 font-semibold block">Intervalo</span><span className="font-bold text-slate-800">{profile?.tempo_descanso_min || '-'} min</span></div>
                            </div>
                            <div className="pt-2 border-t border-slate-200/60 mt-2">
                              <span className="text-slate-400 font-semibold block mb-2">Grade Semanal</span>
                              <div className="space-y-1">
                                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => {
                                  const horario = dia === 'Sábado' || dia === 'Domingo' ? 'Folga' : `${profile?.horario_entrada || '08:00'} - ${profile?.horario_saida || '18:00'}`;
                                  return (
                                    <div key={dia} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-1">
                                      <span className="font-semibold text-slate-600">{dia}</span>
                                      <span className={`font-bold ${horario === 'Folga' ? 'text-slate-400' : 'text-slate-800'}`}>{horario}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Histórico Contratual</h3>
                        {profile?.contract_history?.length ? (
                          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {/* Renderizar histórico real aqui depois */}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Nenhum histórico contratual registrado.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'financeiro' && (
                    <motion.div key="financeiro" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-600" /> Dados Bancários & PIX
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Chave PIX</span><span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg inline-block mt-1">{profile?.chave_pix || 'Não informada'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Tipo de Chave</span><span className="font-bold text-slate-800">{profile?.tipo_chave_pix || 'Não informado'}</span></div>
                            <div className="pt-2 border-t border-slate-200/60 mt-2 grid grid-cols-2 gap-4">
                              <div><span className="text-slate-400 font-semibold block">Banco</span><span className="font-bold text-slate-800">{profile?.banco_agencia || 'Não informado'}</span></div>
                              <div><span className="text-slate-400 font-semibold block">Conta</span><span className="font-bold text-slate-800">{profile?.banco_conta || 'Não informada'}</span></div>
                            </div>
                            <div><span className="text-slate-400 font-semibold block">Titular</span><span className="font-bold text-slate-800">{profile?.nome_titular || 'Não informado'} ({profile?.cpf_cnpj_titular || '-'})</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" /> Parâmetros de Pagamento
                          </h3>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Tipo de Pagamento</span><span className="font-bold text-slate-800">{profile?.tipo_pagamento || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Periodicidade</span><span className="font-bold text-slate-800">{profile?.periodicidade_pagamento || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Valor da Diária</span><span className="font-bold text-emerald-600 text-sm">{profile?.valor_diaria ? `R$ ${Number(profile.valor_diaria).toFixed(2)}` : 'Não informado'}</span></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Histórico de Pagamentos</h3>
                        <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          Nenhum pagamento registrado no histórico.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'frequencia' && (
                    <motion.div key="frequencia" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dias Trabalhados (Mês)</span>
                          <span className="text-2xl font-black text-slate-800">0</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Faltas (Mês)</span>
                          <span className="text-2xl font-black text-red-600">0</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Banco de Horas</span>
                          <span className="text-2xl font-black text-emerald-600">0h</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 flex justify-between items-center">
                          Registro Diário
                          <button className="text-red-600 hover:text-red-700 underline text-[10px]">Ver Mês Completo</button>
                        </h3>
                        <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          Nenhum registro de ponto encontrado para este período.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'feedback' && (
                    <motion.div key="feedback" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">Pontos Fortes</h3>
                          <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 min-h-[80px]">{profile?.pontos_fortes || 'Nenhum registro.'}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-2">Pontos de Melhoria</h3>
                          <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 min-h-[80px]">{profile?.pontos_melhoria || 'Nenhum registro.'}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Avaliações de Desempenho</h3>
                        <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          Nenhuma avaliação estruturada registrada no histórico.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === '1on1' && (
                    <motion.div key="1on1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-2 mb-4">
                          <MessageSquare className="w-4 h-4" /> Anotações Rápidas (Gestão)
                        </h3>
                        <p className="text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200">{profile?.observacoes_gestor || 'Nenhuma anotação de gestão registrada.'}</p>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">Histórico de Reuniões 1:1</h3>
                        <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          Nenhuma reunião registrada no histórico.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'documentos' && (
                    <motion.div key="documentos" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Documentos Anexados</h3>
                          <button className="text-[10px] bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition-colors">
                            + Solicitar Documento
                          </button>
                        </div>
                        <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-slate-300 mb-2" />
                          <p>Nenhum documento anexado a este perfil.</p>
                          <p className="text-[10px] text-slate-400">RGs, Contratos assinados, Comprovantes de residência aparecerão aqui.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}



                </AnimatePresence>
              </div>

            </div>

        </div>
      </div>
    </AppShell>
  );
}
