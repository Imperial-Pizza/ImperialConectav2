'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/layouts/AppShell';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { usePerfil } from '@/features/perfil/hooks/usePerfil';
import { perfilApi, type TwoFactorSetupResponse } from '@/features/perfil/apis/perfilApi';
import { ProfileTab } from '@/features/perfil/types';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User as UserIcon, 
  CreditCard, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
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
  AlertCircle,
  Pencil,
  X,
  Check,
  CheckCircle2,
  Save,
  QrCode,
  Copy,
  Lock,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Não informado';
  if (dateString.includes('/')) return dateString;
  // 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:mm:ss' → evita deslocamento de fuso ao usar new Date()
  const m = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR');
};



export default function PerfilPage() {
  const { data: apiData, isLoading, isSaving, error, save, reload } = usePerfil();
  
  const [profileTab, setProfileTab] = useState<ProfileTab>('pessoal');

  // Controle de 2FA (Autenticação de 2 Fatores)
  const [twoFaModal, setTwoFaModal] = useState<'setup' | 'disable' | null>(null);
  const [twoFaStep, setTwoFaStep] = useState<'qr' | 'backup'>('qr');
  const [twoFaSetupData, setTwoFaSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaPassword, setTwoFaPassword] = useState('');
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Controle de Alteração de Senha
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Controle de Upload e Visualização de Documentos (com compressão leve no cliente)
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docImageDataUrl, setDocImageDataUrl] = useState('');
  const [docOriginalSizeKb, setDocOriginalSizeKb] = useState(0);
  const [docCompressedSizeKb, setDocCompressedSizeKb] = useState(0);
  const [docCompressing, setDocCompressing] = useState(false);
  const [docSaving, setDocSaving] = useState(false);
  const [docDeletingId, setDocDeletingId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ nome: string; url: string; data?: string } | null>(null);

  const compressImageToLightweightDataUrl = (file: File): Promise<{ dataUrl: string; compressedKb: number; originalKb: number }> => {
    return new Promise((resolve, reject) => {
      const originalKb = Math.max(1, Math.round(file.size / 1024));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem.'));
      reader.onload = () => {
        const img = new window.Image();
        img.onerror = () => reject(new Error('Formato de imagem inválido.'));
        img.onload = () => {
          const MAX_DIMENSION = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width >= height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível processar a imagem.'));
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          let dataUrl = canvas.toDataURL('image/webp', 0.72);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          }

          // Se ainda passar de ~220 KB, reduz mais um nível a qualidade para garantir leveza no banco
          if (dataUrl.length > 300000) {
            dataUrl = canvas.toDataURL('image/webp', 0.55);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', 0.55);
            }
          }

          const compressedBytes = Math.round((dataUrl.length * 3) / 4);
          const compressedKb = Math.max(1, Math.round(compressedBytes / 1024));

          resolve({ dataUrl, compressedKb, originalKb });
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSelectDocFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem (JPG, PNG ou WebP).');
      return;
    }

    try {
      setDocCompressing(true);
      const { dataUrl, compressedKb, originalKb } = await compressImageToLightweightDataUrl(file);
      setDocImageDataUrl(dataUrl);
      setDocOriginalSizeKb(originalKb);
      setDocCompressedSizeKb(compressedKb);
      if (!docTitle.trim()) {
        const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setDocTitle(cleanFileName);
      }
      toast.success(`Foto otimizada para ${compressedKb} KB!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao comprimir imagem.');
    } finally {
      setDocCompressing(false);
    }
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || docTitle.trim().length < 2) {
      toast.error('Informe um título para o documento.');
      return;
    }
    if (!docImageDataUrl) {
      toast.error('Selecione a foto do documento.');
      return;
    }

    try {
      setDocSaving(true);
      await perfilApi.addDocument({
        titulo: docTitle.trim(),
        arquivo_url: docImageDataUrl,
      });
      toast.success('Documento adicionado com sucesso!');
      setDocModalOpen(false);
      setDocTitle('');
      setDocImageDataUrl('');
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar documento.');
    } finally {
      setDocSaving(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      setDocDeletingId(docId);
      await perfilApi.deleteDocument(docId);
      toast.success('Documento removido!');
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover documento.');
    } finally {
      setDocDeletingId(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('A confirmação da nova senha não confere.');
      return;
    }
    try {
      setPasswordLoading(true);
      await perfilApi.changePassword(currentPassword, newPassword);
      toast.success('Senha alterada com sucesso!');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao alterar a senha.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStart2faSetup = async () => {
    try {
      setTwoFaLoading(true);
      const data = await perfilApi.setupTwoFactor();
      setTwoFaSetupData(data);
      setTwoFaCode('');
      setTwoFaStep('qr');
      setCopiedSecret(false);
      setCopiedBackup(false);
      setTwoFaModal('setup');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar configuração de 2FA.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = twoFaCode.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      toast.error('Digite os 6 dígitos gerados pelo aplicativo autenticador.');
      return;
    }
    try {
      setTwoFaLoading(true);
      await perfilApi.enableTwoFactor(cleanCode);
      toast.success('Autenticação de 2 fatores ativada!');
      setTwoFaStep('backup');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Código incorreto. Tente novamente.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleFinish2faSetup = async () => {
    setTwoFaModal(null);
    setTwoFaSetupData(null);
    await reload();
  };

  const handleDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaPassword) {
      toast.error('Informe sua senha atual para confirmar.');
      return;
    }
    try {
      setTwoFaLoading(true);
      await perfilApi.disableTwoFactor(twoFaPassword);
      toast.success('Autenticação de 2 fatores desativada.');
      setTwoFaModal(null);
      setTwoFaPassword('');
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Senha incorreta ou falha ao desativar.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!twoFaSetupData?.secret) return;
    await navigator.clipboard.writeText(twoFaSetupData.secret);
    setCopiedSecret(true);
    toast.success('Chave secreta copiada!');
    setTimeout(() => setCopiedSecret(false), 2500);
  };

  const handleCopyBackupCodes = async () => {
    if (!twoFaSetupData?.backup_codes?.length) return;
    await navigator.clipboard.writeText(twoFaSetupData.backup_codes.join('\n'));
    setCopiedBackup(true);
    toast.success('Códigos de recuperação copiados!');
    setTimeout(() => setCopiedBackup(false), 2500);
  };

  const handleDownloadBackupCodes = () => {
    if (!twoFaSetupData?.backup_codes?.length) return;
    const content = [
      'KodyVera / Imperial Conecta - Códigos de Recuperação 2FA',
      `Usuário: ${apiData?.user.email || ''}`,
      `Data: ${new Date().toLocaleDateString('pt-BR')}`,
      '',
      'Guarde estes códigos em local seguro. Cada código só pode ser usado uma vez:',
      '',
      ...twoFaSetupData.backup_codes.map((c, i) => `${i + 1}. ${c}`),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imperial-2fa-codigos-recuperacao.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Controle de edição por Card
  type EditCardType = 'cadastrais' | 'contato' | 'emergencia' | 'endereco' | 'bancario' | 'pagamento' | 'novo_pagamento' | null;
  const [editingCard, setEditingCard] = useState<EditCardType>(null);

  // Estados dos formulários de edição
  const [formData, setFormData] = useState({
    // Cadastrais
    nome: '',
    nome_social: '',
    cpf: '',
    data_nascimento: '',
    // Contato
    email_pessoal: '',
    telefone_pessoal: '',
    // Emergência
    contato_emergencia_nome: '',
    contato_emergencia_parentesco: '',
    contato_emergencia_telefone: '',
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    // Bancário & PIX
    chave_pix: '',
    tipo_chave_pix: 'cpf',
    banco_nome: '',
    banco_codigo: '',
    agencia: '',
    conta: '',
    digito_conta: '',
    tipo_conta: 'corrente',
    titular_nome: '',
    titular_cpf: '',
    // Parâmetros de Pagamento
    tipo_pagamento: 'PIX',
    periodicidade_pagamento: 'mensal',
    valor_diaria: '',
    motivo_alteracao: '',
  });

  const [loadingCep, setLoadingCep] = useState(false);

  // Máscaras de entrada
  const maskCpf = (val: string) => {
    return val
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const maskPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 10) {
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  const maskCep = (val: string) => {
    return val
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d{1,3})/, '$1-$2');
  };

  const handleCepLookup = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        setLoadingCep(true);
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const json = await res.json();
        if (!json.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: json.logradouro || prev.logradouro,
            bairro: json.bairro || prev.bairro,
            cidade: json.localidade || prev.cidade,
            estado: json.uf || prev.estado,
          }));
          toast.success('Endereço autocompletado pelo CEP!');
        }
      } catch (e) {
        // Ignora silenciosamente
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleOpenEdit = (card: EditCardType) => {
    if (!apiData) return;
    const { user, profile } = apiData;
    const end = profile?.endereco_detalhes;
    const bank = profile?.dados_bancarios_detalhes;

    const periodicidadeReverseMap: Record<string, string> = {
      'Mensal': 'mensal',
      'Quinzenal': 'quinzenal',
      'Diária / Semanal': 'horista',
      'PJ Mensal': 'pj_fechado',
    };

    setFormData({
      nome: user.name || '',
      nome_social: profile?.nome_social || '',
      cpf: profile?.cpf || '',
      data_nascimento: profile?.data_nascimento ? profile.data_nascimento.substring(0, 10) : '',
      email_pessoal: profile?.email_pessoal || user.email || '',
      telefone_pessoal: profile?.telefone || '',
      contato_emergencia_nome: profile?.contato_emergencia_nome || '',
      contato_emergencia_parentesco: profile?.contato_emergencia_parentesco || '',
      contato_emergencia_telefone: profile?.contato_emergencia_telefone || '',
      cep: end?.cep || '',
      logradouro: end?.logradouro || '',
      numero: end?.numero || '',
      complemento: end?.complemento || '',
      bairro: end?.bairro || '',
      cidade: end?.cidade || '',
      estado: end?.estado || 'SP',
      chave_pix: bank?.chave_pix || profile?.chave_pix || '',
      tipo_chave_pix: bank?.tipo_chave_pix || 'cpf',
      banco_nome: bank?.banco_nome || '',
      banco_codigo: bank?.banco_codigo || '',
      agencia: bank?.agencia || '',
      conta: bank?.conta || '',
      digito_conta: bank?.digito_conta || '',
      tipo_conta: bank?.tipo_conta || 'corrente',
      titular_nome: bank?.titular_nome || profile?.nome_titular || user.name || '',
      titular_cpf: bank?.titular_cpf || profile?.cpf_cnpj_titular || profile?.cpf || '',
      tipo_pagamento: profile?.tipo_pagamento || 'PIX',
      periodicidade_pagamento: (profile?.periodicidade_pagamento && periodicidadeReverseMap[profile.periodicidade_pagamento]) || 'mensal',
      valor_diaria: profile?.valor_diaria !== null && profile?.valor_diaria !== undefined ? String(profile.valor_diaria) : '',
      motivo_alteracao: card === 'novo_pagamento' ? `Pagamento ref. ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}` : 'Atualização de parâmetros de pagamento',
    });

    setEditingCard(card);
  };

  const handleCloseEdit = () => {
    if (isSaving) return;
    setEditingCard(null);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    let payload: Record<string, any> = {};

    if (editingCard === 'cadastrais') {
      const cleanCpf = formData.cpf.replace(/\D/g, '');
      if (cleanCpf && cleanCpf.length !== 11) {
        toast.error('O CPF deve ter exatamente 11 dígitos numéricos.');
        return;
      }
      payload = {
        nome: formData.nome.trim(),
        nome_social: formData.nome_social.trim(),
        cpf: cleanCpf || null,
        data_nascimento: formData.data_nascimento || null,
      };
    } else if (editingCard === 'contato') {
      payload = {
        email_pessoal: formData.email_pessoal.trim(),
        telefone_pessoal: formData.telefone_pessoal.trim(),
        telefone: formData.telefone_pessoal.trim(),
      };
    } else if (editingCard === 'emergencia') {
      payload = {
        contato_emergencia_nome: formData.contato_emergencia_nome.trim(),
        contato_emergencia_parentesco: formData.contato_emergencia_parentesco.trim(),
        contato_emergencia_telefone: formData.contato_emergencia_telefone.trim(),
      };
    } else if (editingCard === 'endereco') {
      payload = {
        cep: formData.cep.replace(/\D/g, ''),
        logradouro: formData.logradouro.trim(),
        numero: formData.numero.trim() || 'S/N',
        complemento: formData.complemento.trim(),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim().toUpperCase(),
      };
    } else if (editingCard === 'bancario') {
      payload = {
        chave_pix: formData.chave_pix.trim(),
        tipo_chave_pix: formData.tipo_chave_pix,
        banco_nome: formData.banco_nome.trim(),
        banco_codigo: formData.banco_codigo.trim(),
        agencia: formData.agencia.trim(),
        conta: formData.conta.trim(),
        digito_conta: formData.digito_conta.trim(),
        tipo_conta: formData.tipo_conta,
        titular_nome: formData.titular_nome.trim(),
        titular_cpf: formData.titular_cpf.replace(/\D/g, ''),
      };
    } else if (editingCard === 'pagamento' || editingCard === 'novo_pagamento') {
      payload = {
        tipo_pagamento: formData.tipo_pagamento.trim(),
        periodicidade_pagamento: formData.periodicidade_pagamento,
        valor_diaria: formData.valor_diaria,
        motivo_alteracao: formData.motivo_alteracao.trim() || 'Pagamento registrado',
        novo_pagamento: editingCard === 'novo_pagamento',
      };
    }

    const ok = await save(payload);
    if (ok) {
      toast.success('Informações atualizadas com sucesso!');
      setEditingCard(null);
    } else {
      toast.error('Não foi possível salvar as informações. Tente novamente.');
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
                  { id: 'financeiro', icon: CreditCard, label: 'Financeiro & PIX' },
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
                      
                      {/* CARD 1: DADOS CADASTRAIS */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-red-600" /> Dados Cadastrais
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit('cadastrais')}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                            title="Editar Dados Cadastrais"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div><span className="text-slate-400 font-semibold block">Nome Completo</span><span className="font-bold text-slate-800">{user.name} {profile?.sobrenome || ''}</span></div>
                          <div><span className="text-slate-400 font-semibold block">Nome Social / Apelido</span><span className="font-bold text-slate-800">{profile?.nome_social || '-'}</span></div>
                          <div><span className="text-slate-400 font-semibold block">CPF</span><span className="font-bold text-slate-800">{profile?.cpf || 'Não informado'}</span></div>
                          <div><span className="text-slate-400 font-semibold block">Data de Nascimento</span><span className="font-bold text-slate-800">{formatDate(profile?.data_nascimento)}</span></div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* CARD 2: CONTATO */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-indigo-600" /> Contato
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit('contato')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                              title="Editar Contato"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">E-mail Corporativo</span><span className="font-bold text-slate-800">{profile?.email_corporativo || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">E-mail Pessoal</span><span className="font-bold text-slate-800">{profile?.email_pessoal || user.email}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Telefone Pessoal</span><span className="font-bold text-slate-800">{profile?.telefone || 'Não informado'}</span></div>
                          </div>
                        </div>

                        {/* CARD 3: EMERGÊNCIA */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-rose-600" /> Emergência
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit('emergencia')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                              title="Editar Emergência"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Nome</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_nome || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Grau de Parentesco</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_parentesco || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Telefone</span><span className="font-bold text-slate-800">{profile?.contato_emergencia_telefone || 'Não informado'}</span></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* CARD 4: ENDEREÇO */}
                      <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600" /> Endereço
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit('endereco')}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-emerald-600 bg-white hover:bg-emerald-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                            title="Editar Endereço"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400 font-semibold block">Residencial</span>
                          <span className="font-bold text-slate-800">{profile?.endereco || 'Não informado'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'seguranca' && (
                    <motion.div key="seguranca" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-600" /> Credenciais & Autenticação
                          </h3>
                          <span
                            className={`font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] ${
                              user.two_factor_enabled
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-200/80 text-slate-600 border border-slate-300/60'
                            }`}
                          >
                            {user.two_factor_enabled ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                2FA Protegido
                              </>
                            ) : (
                              '2FA Desativado'
                            )}
                          </span>
                        </div>

                        {/* Bloco Premium 2FA */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                user.two_factor_enabled
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-red-50 text-red-600 border border-red-100'
                              }`}
                            >
                              {user.two_factor_enabled ? (
                                <ShieldCheck className="w-5 h-5" />
                              ) : (
                                <QrCode className="w-5 h-5" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-slate-900">
                                  Autenticação em 2 Fatores (2FA)
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">
                                {user.two_factor_enabled
                                  ? 'Sua conta está protegida com verificação em duas etapas via aplicativo autenticador (TOTP).'
                                  : 'Adicione uma camada extra de proteção exigindo um código de 6 dígitos do Google Authenticator, Authy ou Microsoft Authenticator ao entrar.'}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center">
                            {user.two_factor_enabled ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setTwoFaPassword('');
                                  setTwoFaModal('disable');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                              >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Desativar 2FA</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleStart2faSetup}
                                disabled={twoFaLoading}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                              >
                                {twoFaLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Preparando...</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Ativar 2FA</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Última Alteração de Senha */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-400 font-semibold block text-[11px]">Última Alteração de Senha</span>
                              <span className="font-bold text-slate-800">{formatDate(user.ultima_alteracao_senha) || 'Não informado'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmNewPassword('');
                              setPasswordModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-[11px] font-bold text-slate-700 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Alterar Senha</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'financeiro' && (
                    <motion.div key="financeiro" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-emerald-600" /> Dados Bancários & PIX
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit('bancario')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-emerald-600 bg-white hover:bg-emerald-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                              title="Editar Dados Bancários e PIX"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Chave PIX</span><span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg inline-block mt-1">{profile?.chave_pix || 'Não informada'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Tipo de Chave</span><span className="font-bold text-slate-800">{profile?.tipo_chave_pix || 'Não informado'}</span></div>
                            <div className="pt-2 border-t border-slate-200/60 mt-2 grid grid-cols-2 gap-4">
                              <div><span className="text-slate-400 font-semibold block">Banco</span><span className="font-bold text-slate-800">{profile?.banco_agencia || 'Não informado'}</span></div>
                              <div><span className="text-slate-400 font-semibold block">Conta</span><span className="font-bold text-slate-800">{profile?.banco_conta || 'Não informada'}</span></div>
                            </div>
                            <div><span className="text-slate-400 font-semibold block">Titular</span><span className="font-bold text-slate-800">{profile?.nome_titular || 'Não informado'} ({profile?.cpf_cnpj_titular ? maskCpf(profile.cpf_cnpj_titular) : '-'})</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-600" /> Parâmetros de Pagamento
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit('pagamento')}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200/80 rounded-lg shadow-2xs transition-all cursor-pointer"
                              title="Editar Parâmetros de Pagamento"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                          </div>
                          <div className="space-y-3 text-xs">
                            <div><span className="text-slate-400 font-semibold block">Tipo de Pagamento</span><span className="font-bold text-slate-800">{profile?.tipo_pagamento || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Periodicidade</span><span className="font-bold text-slate-800">{profile?.periodicidade_pagamento || 'Não informado'}</span></div>
                            <div><span className="text-slate-400 font-semibold block">Valor da Diária / Base</span><span className="font-bold text-emerald-600 text-sm">{profile?.valor_diaria !== null && profile?.valor_diaria !== undefined ? Number(profile.valor_diaria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não informado'}</span></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Histórico de Pagamentos</h3>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit('novo_pagamento')}
                            className="text-[11px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            + Registrar Pagamento
                          </button>
                        </div>
                        {profile?.payments_history?.length ? (
                          <div className="space-y-2.5">
                            {profile.payments_history.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-900">{item.periodo}</p>
                                  <p className="text-[11px] text-slate-500">Data: {formatDate(item.data)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-emerald-600 text-sm">{item.valor}</span>
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Nenhum pagamento registrado no histórico.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'documentos' && (
                    <motion.div key="documentos" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Documentos Anexados</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Fotos comprimidas automaticamente para armazenamento leve</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setDocTitle('');
                              setDocImageDataUrl('');
                              setDocOriginalSizeKb(0);
                              setDocCompressedSizeKb(0);
                              setDocModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs bg-red-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-sm shadow-red-600/20 hover:bg-red-700 transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>+ Adicionar Documento</span>
                          </button>
                        </div>
                        {profile?.documents?.length ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {profile.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 hover:border-slate-300 transition-all">
                                <div className="flex items-center gap-3 min-w-0">
                                  {doc.url && doc.url.startsWith('data:image/') ? (
                                    <button
                                      type="button"
                                      onClick={() => setPreviewDoc({ nome: doc.nome, url: doc.url!, data: doc.data_envio })}
                                      className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 cursor-pointer group relative"
                                      title="Clique para ampliar"
                                    >
                                      <img src={doc.url} alt={doc.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </button>
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{doc.nome}</p>
                                    <p className="text-[10px] text-slate-400">Anexado em {formatDate(doc.data_envio)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {doc.url && (
                                    <button
                                      type="button"
                                      onClick={() => setPreviewDoc({ nome: doc.nome, url: doc.url!, data: doc.data_envio })}
                                      className="p-2 text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                                      title="Visualizar foto"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={docDeletingId === doc.id}
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                    title="Remover documento"
                                  >
                                    {docDeletingId === doc.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-2">
                            <ImageIcon className="w-9 h-9 text-slate-300 mb-1" />
                            <p className="font-bold text-slate-700">Nenhum documento anexado a este perfil.</p>
                            <p className="text-[11px] text-slate-400">Clique em &ldquo;+ Adicionar Documento&rdquo; para enviar a foto do RG, CNH, Comprovante ou Contrato.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}



                </AnimatePresence>
              </div>

            </div>

        </div>
      </div>

      {/* MODAL DE EDIÇÃO POR CARD */}
      <AnimatePresence>
        {editingCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop escuro com blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseEdit}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            {/* Conteúdo do Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 text-red-600">
                    {editingCard === 'cadastrais' && <UserIcon className="w-5 h-5 text-red-600" />}
                    {editingCard === 'contato' && <Mail className="w-5 h-5 text-indigo-600" />}
                    {editingCard === 'emergencia' && <Phone className="w-5 h-5 text-rose-600" />}
                    {editingCard === 'endereco' && <MapPin className="w-5 h-5 text-emerald-600" />}
                    {editingCard === 'bancario' && <CreditCard className="w-5 h-5 text-emerald-600" />}
                    {(editingCard === 'pagamento' || editingCard === 'novo_pagamento') && <Activity className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {editingCard === 'cadastrais' && 'Editar Dados Cadastrais'}
                      {editingCard === 'contato' && 'Editar Contatos'}
                      {editingCard === 'emergencia' && 'Editar Contato de Emergência'}
                      {editingCard === 'endereco' && 'Editar Endereço Residencial'}
                      {editingCard === 'bancario' && 'Editar Dados Bancários & PIX'}
                      {editingCard === 'pagamento' && 'Editar Parâmetros de Pagamento'}
                      {editingCard === 'novo_pagamento' && 'Registrar Pagamento no Histórico'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Atualize as informações cadastrais do prontuário
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSaveCard} className="space-y-4">
                {/* CARD: DADOS CADASTRAIS */}
                {editingCard === 'cadastrais' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="Nome e sobrenome"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nome Social / Apelido
                      </label>
                      <input
                        type="text"
                        value={formData.nome_social}
                        onChange={(e) => setFormData({ ...formData, nome_social: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="Como prefere ser chamado"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          CPF
                        </label>
                        <input
                          type="text"
                          maxLength={14}
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: maskCpf(e.target.value) })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={formData.data_nascimento}
                          onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD: CONTATO */}
                {editingCard === 'contato' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        E-mail Corporativo
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profile?.email_corporativo || 'Não informado'}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        O e-mail corporativo é gerenciado pelo setor de TI/RH.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        E-mail Pessoal
                      </label>
                      <input
                        type="email"
                        value={formData.email_pessoal}
                        onChange={(e) => setFormData({ ...formData, email_pessoal: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Telefone Pessoal
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={formData.telefone_pessoal}
                        onChange={(e) => setFormData({ ...formData, telefone_pessoal: maskPhone(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                )}

                {/* CARD: EMERGÊNCIA */}
                {editingCard === 'emergencia' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nome do Contato
                      </label>
                      <input
                        type="text"
                        value={formData.contato_emergencia_nome}
                        onChange={(e) => setFormData({ ...formData, contato_emergencia_nome: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="Ex: Maria dos Santos"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Grau de Parentesco
                      </label>
                      <input
                        type="text"
                        value={formData.contato_emergencia_parentesco}
                        onChange={(e) => setFormData({ ...formData, contato_emergencia_parentesco: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="Ex: Mãe, Cônjuge, Irmão, Amigo"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Telefone de Emergência
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={formData.contato_emergencia_telefone}
                        onChange={(e) => setFormData({ ...formData, contato_emergencia_telefone: maskPhone(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="(11) 98888-8888"
                      />
                    </div>
                  </div>
                )}

                {/* CARD: ENDEREÇO */}
                {editingCard === 'endereco' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>CEP</span>
                          {loadingCep && <Loader2 className="w-3 h-3 animate-spin text-red-600" />}
                        </label>
                        <input
                          type="text"
                          maxLength={9}
                          value={formData.cep}
                          onChange={(e) => {
                            const v = maskCep(e.target.value);
                            setFormData({ ...formData, cep: v });
                            handleCepLookup(v);
                          }}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="00000-000"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Logradouro / Rua
                        </label>
                        <input
                          type="text"
                          value={formData.logradouro}
                          onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Rua, Avenida, Praça..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.numero}
                          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Ex: 123 ou S/N"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.complemento}
                          onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Apto 42, Bloco B..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.bairro}
                          onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Bairro"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Cidade"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          UF / Estado
                        </label>
                        <input
                          type="text"
                          maxLength={2}
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium uppercase text-center"
                          placeholder="SP"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD: DADOS BANCÁRIOS & PIX */}
                {editingCard === 'bancario' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de Chave PIX</label>
                        <select
                          value={formData.tipo_chave_pix}
                          onChange={(e) => setFormData({ ...formData, tipo_chave_pix: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        >
                          <option value="cpf">CPF</option>
                          <option value="email">E-mail</option>
                          <option value="telefone">Telefone</option>
                          <option value="aleatoria">Chave Aleatória</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Chave PIX</label>
                        <input
                          type="text"
                          value={formData.chave_pix}
                          onChange={(e) => setFormData({ ...formData, chave_pix: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-mono font-medium"
                          placeholder="CPF, e-mail, celular ou chave aleatória"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nome do Banco *</label>
                        <input
                          type="text"
                          required
                          value={formData.banco_nome}
                          onChange={(e) => setFormData({ ...formData, banco_nome: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Ex: Nubank, Itaú, Bradesco..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Cód. Banco</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={formData.banco_codigo}
                          onChange={(e) => setFormData({ ...formData, banco_codigo: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Ex: 260"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Agência *</label>
                        <input
                          type="text"
                          required
                          value={formData.agencia}
                          onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="0001"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Conta *</label>
                        <input
                          type="text"
                          required
                          value={formData.conta}
                          onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Número da conta"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Dígito</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={formData.digito_conta}
                          onChange={(e) => setFormData({ ...formData, digito_conta: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium text-center"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Titular da Conta *</label>
                        <input
                          type="text"
                          required
                          value={formData.titular_nome}
                          onChange={(e) => setFormData({ ...formData, titular_nome: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="Nome completo do titular"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">CPF do Titular *</label>
                        <input
                          type="text"
                          required
                          maxLength={14}
                          value={maskCpf(formData.titular_cpf)}
                          onChange={(e) => setFormData({ ...formData, titular_cpf: maskCpf(e.target.value) })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD: PARÂMETROS DE PAGAMENTO / NOVO PAGAMENTO */}
                {(editingCard === 'pagamento' || editingCard === 'novo_pagamento') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipo de Pagamento *</label>
                        <select
                          value={formData.tipo_pagamento}
                          onChange={(e) => setFormData({ ...formData, tipo_pagamento: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        >
                          <option value="PIX">PIX</option>
                          <option value="Transferência Bancária (TED)">Transferência Bancária (TED)</option>
                          <option value="Depósito em Conta">Depósito em Conta</option>
                          <option value="Espécie / Dinheiro">Espécie / Dinheiro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Periodicidade *</label>
                        <select
                          value={formData.periodicidade_pagamento}
                          onChange={(e) => setFormData({ ...formData, periodicidade_pagamento: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        >
                          <option value="horista">Diária / Semanal</option>
                          <option value="quinzenal">Quinzenal</option>
                          <option value="mensal">Mensal</option>
                          <option value="pj_fechado">PJ Mensal</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Valor da Diária / Base (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.valor_diaria}
                        onChange={(e) => setFormData({ ...formData, valor_diaria: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-bold"
                        placeholder="Ex: 250.00"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Descrição / Referência</label>
                      <input
                        type="text"
                        value={formData.motivo_alteracao}
                        onChange={(e) => setFormData({ ...formData, motivo_alteracao: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                        placeholder="Ex: Pagamento ref. Novembro/2026"
                      />
                    </div>
                  </div>
                )}

                {/* Botões do Rodapé */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIGURAÇÃO 2FA (PREMIUM) */}
      <AnimatePresence>
        {twoFaModal === 'setup' && twoFaSetupData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !twoFaLoading && twoFaStep === 'qr' && setTwoFaModal(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${twoFaStep === 'backup' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {twoFaStep === 'backup' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {twoFaStep === 'qr' ? 'Configurar Autenticação 2FA' : 'Autenticação 2FA Ativada!'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {twoFaStep === 'qr'
                        ? 'Etapa 1 de 2 • Vincule seu aplicativo autenticador'
                        : 'Etapa 2 de 2 • Salve seus códigos de recuperação'}
                    </p>
                  </div>
                </div>
                {twoFaStep === 'qr' && (
                  <button
                    type="button"
                    onClick={() => !twoFaLoading && setTwoFaModal(null)}
                    disabled={twoFaLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {twoFaStep === 'qr' ? (
                <form onSubmit={handleEnable2fa} className="space-y-5">
                  {/* QR Code Container */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center text-center space-y-4">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                      <QRCodeSVG
                        value={twoFaSetupData.qr_code_uri}
                        size={172}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm">
                      Abra seu app autenticador (<strong className="text-slate-800">Google Authenticator</strong>, <strong className="text-slate-800">Authy</strong> ou <strong className="text-slate-800">Microsoft Authenticator</strong>) e escaneie o QR Code acima.
                    </p>
                  </div>

                  {/* Chave Secreta Manual */}
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-bold text-slate-500">
                      Não consegue escanear? Copie a chave de configuração manual:
                    </span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                      <code className="text-xs font-mono font-bold text-slate-800 tracking-wider flex-1 select-all">
                        {twoFaSetupData.secret}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-red-600 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSecret ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Input do Código de 6 dígitos */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Digite o código de 6 dígitos exibido no app *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      autoFocus
                      value={twoFaCode}
                      onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 text-lg font-mono font-black tracking-[0.45em] text-center bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setTwoFaModal(null)}
                      disabled={twoFaLoading}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={twoFaLoading || twoFaCode.length !== 6}
                      className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {twoFaLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verificar e Ativar</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 leading-relaxed">
                      <strong>Guarde seus códigos de recuperação!</strong> Se você perder acesso ao seu celular, cada código abaixo permite entrar na sua conta uma única vez.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    {twoFaSetupData.backup_codes.map((code, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-center font-mono text-xs font-bold text-slate-800 tracking-wider select-all"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyBackupCodes}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      {copiedBackup ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedBackup ? 'Códigos Copiados!' : 'Copiar Códigos'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadBackupCodes}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar (.txt)</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleFinish2faSetup}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Concluir Configuração</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE DESATIVAÇÃO 2FA */}
      <AnimatePresence>
        {twoFaModal === 'disable' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !twoFaLoading && setTwoFaModal(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 sm:p-7 z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Desativar 2FA</h3>
                    <p className="text-xs text-slate-500 font-medium">Confirme sua identidade para continuar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !twoFaLoading && setTwoFaModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDisable2fa} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ao desativar a autenticação em 2 fatores, sua conta voltará a exigir apenas e-mail e senha no login.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Digite sua senha atual *
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={twoFaPassword}
                    onChange={(e) => setTwoFaPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-900 font-medium"
                    placeholder="Sua senha atual"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setTwoFaModal(null)}
                    disabled={twoFaLoading}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={twoFaLoading || !twoFaPassword}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {twoFaLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Desativando...</span>
                      </>
                    ) : (
                      <span>Confirmar Desativação</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ALTERAÇÃO DE SENHA */}
      <AnimatePresence>
        {passwordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Alterar Senha</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Senha Atual *</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nova Senha *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirmar Nova Senha *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                    placeholder="Repita a nova senha"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    disabled={passwordLoading}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar Nova Senha</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ADICIONAR DOCUMENTO (COM COMPRESSÃO LEVE) */}
      <AnimatePresence>
        {docModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Anexar Documento</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Compressão automática WebP para não pesar no banco</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !docSaving && setDocModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDocument} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Título do Documento *</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-900 font-medium"
                    placeholder="Ex: RG Frente e Verso, CNH, Comprovante..."
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['RG (Frente/Verso)', 'CNH', 'CPF', 'Comprovante de Residência', 'Contrato Assinado'].map((sugestao) => (
                      <button
                        key={sugestao}
                        type="button"
                        onClick={() => setDocTitle(sugestao)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold transition-colors cursor-pointer"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto do Documento *</label>
                  <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50 hover:bg-red-50/20 rounded-2xl p-4 cursor-pointer transition-all text-center relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectDocFile}
                      className="hidden"
                    />
                    {docCompressing ? (
                      <div className="flex flex-col items-center gap-2 py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                        <span className="text-xs font-bold text-slate-600">Otimizando imagem...</span>
                      </div>
                    ) : docImageDataUrl ? (
                      <div className="space-y-2.5 w-full flex flex-col items-center">
                        <img
                          src={docImageDataUrl}
                          alt="Preview do documento"
                          className="max-h-36 rounded-xl border border-slate-200 object-contain bg-white shadow-xs"
                        />
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Tamanho leve: {docCompressedSizeKb} KB
                            {docOriginalSizeKb > docCompressedSizeKb ? ` (original: ${docOriginalSizeKb} KB)` : ''}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 underline">Clique para trocar a foto</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-4">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-1">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Clique para selecionar a foto</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG ou WebP • Compressão automática inteligente</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDocModalOpen(false)}
                    disabled={docSaving}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={docSaving || docCompressing || !docImageDataUrl || !docTitle.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {docSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar Documento</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE VISUALIZAÇÃO AMPLIADA DO DOCUMENTO */}
      <AnimatePresence>
        {previewDoc && (
          <div
            onClick={() => setPreviewDoc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{previewDoc.nome}</h3>
                  {previewDoc.data && (
                    <p className="text-[10px] text-slate-400">Anexado em {formatDate(previewDoc.data)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.url}
                    download={`${previewDoc.nome.replace(/\s+/g, '-').toLowerCase()}.webp`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex items-center justify-center max-h-[75vh] overflow-auto">
                <img
                  src={previewDoc.url}
                  alt={previewDoc.nome}
                  className="max-w-full max-h-[65vh] rounded-xl border border-slate-200 object-contain bg-white shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </AppShell>
  );
}
