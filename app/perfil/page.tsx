'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/layouts/AppShell';
import { SidebarTabs, SidebarTab } from '@/components/ui/SidebarTabs';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { usePerfil } from '@/features/perfil/hooks/usePerfil';
import { ProfileTab, UpdateProfilePayload } from '@/features/perfil/types';
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
  Edit3, 
  Save, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function PerfilPage() {
  const { data: apiData, isLoading, isSaving, error, save } = usePerfil();
  
  const [profileTab, setProfileTab] = useState<ProfileTab>('pessoal');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [editForm, setEditForm] = useState<UpdateProfilePayload>({});

  // Atualizar form quando carregar
  useEffect(() => {
    if (apiData?.profile && !isEditingProfile) {
      setEditForm({
        sobrenome: apiData.profile.sobrenome || '',
        telefone: apiData.profile.telefone || '',
        data_nascimento: apiData.profile.data_nascimento || '',
        contato_emergencia_nome: apiData.profile.contato_emergencia_nome || '',
        contato_emergencia_telefone: apiData.profile.contato_emergencia_telefone || '',
        contato_emergencia_parentesco: apiData.profile.contato_emergencia_parentesco || '',
        chave_pix: apiData.profile.chave_pix || '',
        nome_titular: apiData.profile.nome_titular || '',
        cpf_cnpj_titular: apiData.profile.cpf_cnpj_titular || '',
        banco_agencia: apiData.profile.banco_agencia || '',
        banco_conta: apiData.profile.banco_conta || '',
        tipo_conta: apiData.profile.tipo_conta || '',
      });
    }
  }, [apiData, isEditingProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiData) return;
    
    // Precisamos mesclar o que o usuário quer mudar
    // A API UpdateProfilePayload usa campos isolados
    const success = await save(editForm);
    
    if (success) {
      setIsEditingProfile(false);
      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

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

  return (
    <AppShell activeModule="perfil">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {error && (
          <StatusBanner type="error" title="Erro">
            {error}
          </StatusBanner>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm mb-6"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 min-h-[600px]">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                {apiData.user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1">
                    Setor: {apiData.user.sector || 'Não definido'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold mb-1">
                    ID: #{apiData.user.id}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {apiData.user.name} {apiData.profile?.sobrenome || ''}
                </h2>
                <p className="text-xs text-slate-500">{apiData.profile?.funcao_principal || apiData.user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2 shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Informações</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              )}
            </div>
          </div>

          {!isEditingProfile ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              
              <div className="lg:col-span-3 space-y-2 shrink-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">Navegação do Perfil</p>
                
                <button
                  onClick={() => setProfileTab('pessoal')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                    profileTab === 'pessoal' 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Credenciais & Pessoal</span>
                </button>

                <button
                  onClick={() => setProfileTab('contrato')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                    profileTab === 'contrato' 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Contrato & Jornada</span>
                </button>

                <button
                  onClick={() => setProfileTab('financeiro')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                    profileTab === 'financeiro' 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Financeiro & PIX</span>
                </button>

                <button
                  onClick={() => setProfileTab('feedback')}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                    profileTab === 'feedback' 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Avaliação & Feedback</span>
                </button>
              </div>

              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  {profileTab === 'pessoal' && (
                    <motion.div key="pessoal" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-600" /> Dados de Acesso & Conta
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block">E-mail Cadastrado</span>
                            <span className="font-bold text-slate-800">{apiData.user.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Perfil de Permissão</span>
                            <span className="font-bold text-slate-800 uppercase">{apiData.user.role}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Autenticação de 2 Fatores (2FA)</span>
                            <span className="font-bold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] mt-1 bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <Key className="w-3 h-3" /> {apiData.user.two_factor_enabled ? 'Ativado' : 'Desativado'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-rose-600" /> Informações Pessoais & Emergência
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block">Data de Nascimento</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.data_nascimento || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Telefone Pessoal</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.telefone || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Contato de Emergência</span>
                            <span className="font-bold text-slate-800">
                              {apiData.profile?.contato_emergencia_nome || 'Não informado'} {apiData.profile?.contato_emergencia_parentesco ? `(${apiData.profile.contato_emergencia_parentesco})` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'contrato' && (
                    <motion.div key="contrato" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" /> Detalhes Contratuais
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block">Tipo de Contratação</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.tipo_contratacao || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Função Principal</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.funcao_principal || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Data de Admissão</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.data_admissao || 'Não informado'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" /> Jornada & Horários
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-slate-400 font-semibold block">Entrada</span>
                              <span className="font-bold text-slate-800">{apiData.profile?.horario_entrada || '--:--'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-semibold block">Saída</span>
                              <span className="font-bold text-slate-800">{apiData.profile?.horario_saida || '--:--'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Carga Horária Semanal</span>
                            <span className="font-bold text-slate-800">{apiData.profile?.jornada_horas || '0'} horas</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'financeiro' && (
                    <motion.div key="financeiro" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" /> Pagamento & PIX
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block">Chave PIX Principal</span>
                            <span className="font-mono font-bold text-slate-800 bg-white px-3 py-2 rounded-xl border border-slate-200 block mt-1">{apiData.profile?.chave_pix || 'Não informada'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Valor da Diária</span>
                            <span className="font-bold text-emerald-600 text-sm">R$ {Number(apiData.profile?.valor_diaria || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'feedback' && (
                    <motion.div key="feedback" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">Pontos Fortes</h3>
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">{apiData.profile?.pontos_fortes || 'Nenhum registro.'}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-2">Pontos de Melhoria</h3>
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">{apiData.profile?.pontos_melhoria || 'Nenhum registro.'}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-2">1on1 & Gestão</h3>
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">{apiData.profile?.observacoes_gestor || 'Nenhum registro.'}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-6 pt-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">Editar Informações Cadastrais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sobrenome</label>
                  <input type="text" value={editForm.sobrenome || ''} onChange={(e) => setEditForm({...editForm, sobrenome: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input type="text" value={editForm.telefone || ''} onChange={(e) => setEditForm({...editForm, telefone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chave PIX</label>
                  <input type="text" value={editForm.chave_pix || ''} onChange={(e) => setEditForm({...editForm, chave_pix: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" />
                </div>
              </div>
              
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 pt-4">Contato de Emergência</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome (Emergência)</label>
                  <input type="text" value={editForm.contato_emergencia_nome || ''} onChange={(e) => setEditForm({...editForm, contato_emergencia_nome: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone (Emergência)</label>
                  <input type="text" value={editForm.contato_emergencia_telefone || ''} onChange={(e) => setEditForm({...editForm, contato_emergencia_telefone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parentesco</label>
                  <input type="text" value={editForm.contato_emergencia_parentesco || ''} onChange={(e) => setEditForm({...editForm, contato_emergencia_parentesco: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-colors disabled:opacity-50">
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </AppShell>
  );
}
