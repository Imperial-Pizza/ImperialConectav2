'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pizza, 
  ShieldAlert, 
  LockKeyhole, 
  Send, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock,
  EyeOff,
  X,
  Link as LinkIcon,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [category, setCategory] = useState('sanitaria');
  const [department, setDepartment] = useState('cozinha');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState('');
  
  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // React Bits style ambient light animation hook
  const [shineIndex, setShineIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!description.trim() || !evidenceUrl.trim()) return;
    
    // Validate URL format strictly
    try {
      new URL(evidenceUrl);
    } catch (_) {
      alert("Por favor, insira um link de evidência válido (ex: https://...)");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const randomCode = 'IMP-ETHICS-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedProtocol(randomCode);
      setIsReportModalOpen(false);
      setIsSuccessModalOpen(true);
      setDescription('');
      setEvidenceUrl('');
    }, 1200);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTrackLoading(true);
    setTimeout(() => {
      setTrackLoading(false);
      setTrackedResult({
        protocol: trackInput.toUpperCase(),
        category: 'Segurança Alimentar e Normas Sanitárias',
        status: 'Em análise pelo Comitê de Ética Independente',
        date: '02/10/2026',
        updates: [
          { date: '02/10/2026 10:15', note: 'Denúncia recebida com criptografia de ponta a ponta.' },
          { date: '02/10/2026 10:30', note: 'Encaminhada para auditoria interna de conformidade.' }
        ]
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* React Bits Ambient Light Orb Effect */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none transition-all duration-700"
        style={{ 
          top: `${10 + Math.sin(shineIndex * 0.08) * 10}%`, 
          left: `${20 + Math.cos(shineIndex * 0.08) * 10}%` 
        }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none transition-all duration-700"
        style={{ 
          bottom: `${10 + Math.cos(shineIndex * 0.08) * 10}%`, 
          right: `${20 + Math.sin(shineIndex * 0.08) * 10}%` 
        }}
      />

      {/* Header section with Framer Motion entry */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-16 py-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <Pizza className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-slate-900">IMPERIAL</span>
              <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">ETHICS OS</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Canal Oficial de Conformidade & Denúncias</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTrackModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Consultar Protocolo</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main content body with Scroll Reveal effect */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 lg:py-16 relative z-10 space-y-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center space-y-6 max-w-3xl mx-auto pt-6"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Sua voz protege a excelência da <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">Imperial Pizza</span>.
          </h1>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Este canal é seguro, confidencial e independente. Utilize para relatar qualquer violação às normas sanitárias, de conduta ética, assédio ou irregularidades financeiras.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReportModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-3 transition-all"
            >
              <LockKeyhole className="w-5 h-5" />
              <span>Fazer Denúncia Anônima</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTrackModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-sm flex items-center gap-3 transition-all"
            >
              <Search className="w-5 h-5 text-red-600" />
              <span>Acompanhar Protocolo Existente</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pillar Cards with Motion scroll reveal */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
        >
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Anonimato Garantido</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nenhum registro de IP, endereço de e-mail ou metadado pessoal é coletado ou armazenado. Sua identidade permanece inviolável.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Comitê Independente</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              As denúncias são analisadas por auditoria externa independente e imparcial, garantindo rigor e proteção contra retaliações.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Acompanhamento Seguro</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ao concluir o relato, você recebe um código de protocolo exclusivo para verificar o andamento da investigação a qualquer momento.
            </p>
          </motion.div>
        </motion.div>

        {/* FAQ Accordion using HTML details and summary directly on page */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">Tem dúvidas sobre como o canal funciona?</h4>
              <p className="text-xs text-slate-500">Consulte nosso guia detalhado sobre políticas de compliance e segurança alimentar.</p>
            </div>
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm self-start">
              Ver Perguntas Frequentes
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <details className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 open:bg-white transition-all">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm cursor-pointer list-none">
                <span>1. É realmente obrigatório me identificar no canal?</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-normal">
                Não. O canal foi projetado para ser 100% anônimo por padrão. Você pode relatar incidentes sem fornecer nenhum dado pessoal.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 open:bg-white transition-all">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm cursor-pointer list-none">
                <span>2. Por que o link da evidência é obrigatório?</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-normal">
                Para que o comitê de ética independente consiga investigar adequadamente, solicitamos obrigatoriamente um link seguro de comprovação (foto, documento ou gravação).
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 open:bg-white transition-all">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm cursor-pointer list-none">
                <span>3. Existe risco de sofrer retaliação?</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed font-normal">
                A política da Imperial Pizza proíbe rigorosamente qualquer forma de retaliação a colaboradores ou parceiros que relatem irregularidades de boa-fé.
              </p>
            </details>
          </div>
        </motion.div>

      </main>

      {/* Report Modal with Framer Motion */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Registrar Nova Denúncia</h3>
                    <p className="text-xs text-slate-500">Preencha os campos com precisão.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Categoria da Ocorrência
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-red-600"
                  >
                    <option value="sanitaria">Segurança Alimentar / Normas Sanitárias / Cozinha</option>
                    <option value="conduta">Conduta Ética / Assédio / Conflitos Interpessoais</option>
                    <option value="financeiro">Irregularidade Financeira / Caixa / Fraude</option>
                    <option value="outro">Outro Assunto de Conformidade</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Área / Departamento Envolvido
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-red-600"
                  >
                    <option value="cozinha">Cozinha / Forno / Produção</option>
                    <option value="atendimento">Salão / Atendimento / Mesas</option>
                    <option value="delivery">Delivery / Logística</option>
                    <option value="administrativo">Administrativo / Gestão</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Descrição Detalhada dos Fatos *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Relate o que aconteceu, quando ocorreu, se há testemunhas..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                {/* Mandatory URL Link Evidence Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Anexar Evidência (Link)</span>
                    <span className="text-red-600">* (Obrigatório)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      required
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="https://exemplo.com/evidencia-ou-documento"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Insira um link válido (HTTPS) para imagem, documento ou gravação comprobatória.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Seus dados de navegação são descartados instantaneamente. Um número de protocolo exclusivo será gerado.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-2 transition-all disabled:opacity-75"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Denúncia</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-slate-200 relative"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Denúncia Enviada com Sucesso!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  O comitê de ética independente recebeu sua manifestação de forma totalmente anônima.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Seu Número de Protocolo</span>
                <div className="text-lg font-black font-mono text-red-600 tracking-wider">
                  {submittedProtocol}
                </div>
              </div>

              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                ⚠ Guarde este número em local seguro para consultar o andamento da investigação.
              </p>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => { setIsSuccessModalOpen(false); setTrackInput(submittedProtocol); setIsTrackModalOpen(true); }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20"
                >
                  Consultar este Protocolo Agora
                </button>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Track Protocol Modal */}
      <AnimatePresence>
        {isTrackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Acompanhar Denúncia</h3>
                    <p className="text-xs text-slate-500">Insira seu código de protocolo.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTrackModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Número de Protocolo
                  </label>
                  <input
                    type="text"
                    required
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Ex: IMP-ETHICS-849201"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-red-600"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={trackLoading}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {trackLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>Verificar Status da Investigação</span>}
                </motion.button>
              </form>

              {trackedResult && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-900">{trackedResult.protocol}</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold">Ativo</span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Categoria:</strong> {trackedResult.category}</p>
                    <p><strong>Data de Abertura:</strong> {trackedResult.date}</p>
                    <p><strong>Status Atual:</strong> <span className="text-amber-600 font-bold">{trackedResult.status}</span></p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Histórico de Andamento</span>
                    {trackedResult.updates.map((up, idx) => (
                      <div key={idx} className="text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-0.5 shadow-sm">
                        <span className="text-[10px] text-red-600 font-mono font-bold">{up.date}</span>
                        <p className="text-slate-700">{up.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-500 space-y-2 shadow-inner">
        <p className="font-bold text-slate-700">IMPERIAL PIZZA • COMPLIANCE & ÉTICA V4.0</p>
        <p>© 2026 Imperial Pizza. Todos os direitos reservados. Canal criptografado de denúncias anônimas.</p>
      </footer>

    </div>
  );
}
