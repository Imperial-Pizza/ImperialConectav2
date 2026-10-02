'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pizza, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  LayoutDashboard, 
  UtensilsCrossed, 
  DollarSign, 
  Users, 
  LogOut, 
  Bell, 
  Search, 
  TrendingUp, 
  Clock,
  Sparkles,
  ChefHat,
  ShieldAlert,
  X,
  Send,
  CheckCircle2,
  Bot,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('usuario3@imperial.com');
  const [password, setPassword] = useState('suasenha123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState('Sistema sincronizado com sucesso.');
  
  // Anonymous Whistleblower Modal State
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = useState(false);
  const [anonymousMessage, setAnonymousMessage] = useState('');
  const [anonymousCategory, setAnonymousCategory] = useState('seguranca');
  const [anonymousSent, setAnonymousSent] = useState(false);

  // Gemini AI Assistant State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // React Bits style animation state hook for shiny text effect
  const [shineIndex, setShineIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Handle login simulation
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAnonymousSubmit = (e) => {
    e.preventDefault();
    if (!anonymousMessage.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnonymousSent(true);
      setTimeout(() => {
        setAnonymousSent(false);
        setIsAnonymousModalOpen(false);
        setAnonymousMessage('');
      }, 2000);
    }, 1000);
  };

  // Gemini API Query Handler with Exponential Backoff
  const handleGeminiQuery = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    const systemPrompt = "Você é o sommelier e assistente operacional sênior da Imperial Pizza, uma pizzaria de alto padrão. Responda em português de forma concisa, profissional e útil para a equipe.";
    const userQuery = aiPrompt;
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    let retries = 3;
    let delay = 1000;
    let success = false;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
          setAiResponse(candidate.content.parts[0].text);
          success = true;
          break;
        } else {
          throw new Error('Resposta inesperada da API');
        }
      } catch (err) {
        if (i === retries - 1) {
          setAiResponse("Não foi possível conectar ao assistente Gemini no momento. Tente novamente mais tarde.");
        } else {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
    setAiLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex bg-white font-sans text-slate-800 antialiased selection:bg-red-600 selection:text-white overflow-x-hidden">
        {/* Left Side: Form Container (Light Mode) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 relative z-10 bg-white min-h-screen">
          {/* Top Brand Logo & Anonymous Report Button Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20 transform hover:scale-105 transition-transform duration-300">
                <Pizza className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <span className="font-black text-xl tracking-wider text-slate-900">IMPERIAL</span>
                <span className="text-xs block text-red-600 font-bold tracking-widest uppercase">Pizza OS</span>
              </div>
            </div>

            {/* Anonymous Report Button in Header */}
            <button
              onClick={() => { window.location.href = '/denuncia'; }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-sm hover:shadow"
              title="Canal de Ética e Denúncia Anônima"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Denúncia Anônima</span>
            </button>
          </div>

          {/* Center Form Section */}
          <div className="w-full max-w-md mx-auto my-auto py-8">
            <div className="space-y-2 mb-8">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Acesse sua conta
              </h1>
              <p className="text-slate-500 text-sm">
                Insira suas credenciais para entrar no Imperial OS.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario3@imperial.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Senha
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); setNotification("Instruções de redefinição enviadas para seu e-mail."); }} 
                    className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-red-600 focus:ring-red-600/20"
                  />
                  <span className="text-slate-600 text-xs font-medium">Lembrar-me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all duration-200 group disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Ou</span>
                </div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => { setIsLoading(true); setTimeout(() => { setIsLoading(false); setIsAuthenticated(true); }, 1000); }}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-200 text-sm shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9C2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z" />
                </svg>
                <span>Continuar com o Google</span>
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-2 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IMPERIAL PIZZA • 2026</span>
            </div>
            <p className="text-xs text-slate-400">
              © 2026 Imperial Pizza. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Right Side: Immersive Visual Hero Banner with React Bits animated lighting flavor */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 min-h-screen">
          <div className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent" />

          {/* React Bits Ambient Light Orb Effect */}
          <div 
            className="absolute w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none transition-all duration-700"
            style={{ 
              top: `${20 + Math.sin(shineIndex * 0.1) * 15}%`, 
              right: `${15 + Math.cos(shineIndex * 0.1) * 15}%` 
            }}
          />

          <div className="relative z-10 flex flex-col justify-between p-16 w-full">
            <div className="flex justify-end">
              {/* React Bits Green-dot Badge Version 4.0 */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Imperial V4.0</span>
              </div>
            </div>

            <div className="space-y-6 max-w-lg">
              <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight">
                Controle total <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                  da sua operação.
                </span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                O sistema operacional definitivo para alta gastronomia. Gestão de comandas, agilidade na produção e controle financeiro em tempo real.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-1 transform hover:translate-y-[-2px] transition-transform">
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>Alta Velocidade</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 font-light">Sincronização imediata.</div>
                </div>
                <div className="space-y-1 transform hover:translate-y-[-2px] transition-transform">
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>Gestão Focada</span>
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-xs text-slate-400 font-light">Fluxo de trabalho contínuo.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anonymous Whistleblower Modal */}
        {false && isAnonymousModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Canal de Denúncia Anônima</h3>
                    <p className="text-[11px] text-slate-500">Sua identidade será totalmente preservada.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAnonymousModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {anonymousSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Denúncia enviada com sucesso!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    O comitê de ética recebeu sua mensagem de forma criptografada e anônima.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAnonymousSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Categoria do Ocorrido
                    </label>
                    <select
                      value={anonymousCategory}
                      onChange={(e) => setAnonymousCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-red-600"
                    >
                      <option value="seguranca">Segurança Alimentar / Normas Sanitárias</option>
                      <option value="conduta">Conduta Ética / Assédio / Conflitos</option>
                      <option value="financeiro">Irregularidade Financeira / Fraude</option>
                      <option value="outro">Outro Assunto Relevante</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Detalhes da Ocorrência
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={anonymousMessage}
                      onChange={(e) => setAnonymousMessage(e.target.value)}
                      placeholder="Descreva detalhadamente o ocorrido, local, data ou envolvidos sem se identificar..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-red-600 resize-none"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Garantimos o sigilo absoluto. Nenhum log de IP ou metadado pessoal é armazenado neste envio.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAnonymousModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-2 transition-all disabled:opacity-75"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Anonimamente</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
              <Pizza className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-slate-900">IMPERIAL</span>
              <span className="text-[10px] block text-red-600 font-bold uppercase tracking-widest">Master OS</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Forno & Comandas</span>
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'financial'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financeiro</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'team'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Equipe & Permissões</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Gemini AI Assistant Quick Trigger Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold shadow-md shadow-red-600/20 hover:opacity-95 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Gemini IA Assistant</span>
          </button>

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                U3
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">Usuário 03</p>
                <p className="text-[10px] text-slate-500 truncate">usuario3@imperial.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sair da Conta"
              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar pedido, mesa ou cliente..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 w-64 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Gemini IA</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Loja Aberta • 18 Mesas Ocupadas
            </div>
            <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          <div className="bg-gradient-to-r from-red-50 via-white to-white border border-red-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Bem-vindo de volta ao Imperial OS!</h4>
                <p className="text-xs text-slate-500 font-medium">{notification}</p>
              </div>
            </div>
            <span className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
              Sessão Ativa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Faturamento Hoje</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">R$ 14.850,00</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span>+18.4% vs ontem</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pizzas Produzidas</span>
                <UtensilsCrossed className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">142 un</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <span>Tempo médio: 14 min</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Mesas Ativas</span>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">18 / 25</div>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                <span>72% de ocupação</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Eficiência da Cozinha</span>
                <Clock className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">98.2%</div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-600 font-bold">
                <span>Excelente performance</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Comandas e Pedidos em Tempo Real</h3>
                <p className="text-xs text-slate-500">Acompanhe o status de saída do forno e entregas.</p>
              </div>
              <button
                onClick={() => setNotification("Lista de pedidos atualizada manualmente.")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Atualizar Status
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Comanda</th>
                    <th className="py-3 px-4">Cliente / Mesa</th>
                    <th className="py-3 px-4">Itens Pedidos</th>
                    <th className="py-3 px-4">Status no Forno</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">#IM-9021</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Mesa 04 • Carlos Alberto</td>
                    <td className="py-3.5 px-4 text-slate-600">1x Calabresa Especial, 1x Coca-Cola 2L</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        🔥 No Forno (8 min)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">R$ 98,50</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">#IM-9022</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Delivery • Ana Paula</td>
                    <td className="py-3.5 px-4 text-slate-600">1x Margherita Trufada, 1x Vinho Tinto</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        ✅ Pronto para Entrega
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">R$ 145,00</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">#IM-9023</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Mesa 12 • Roberto Souza</td>
                    <td className="py-3.5 px-4 text-slate-600">2x Quatro Queijos Imperial, 2x Sucos</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                        📦 Em Preparo / Massa
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">R$ 182,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Gemini AI Assistant Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Gemini IA • Imperial OS</h3>
                  <p className="text-[11px] text-slate-500">Assistente inteligente para alta gastronomia e gestão.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGeminiQuery} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  O que você gostaria de perguntar ou criar?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Sugira um vinho para harmonizar com Margherita Trufada..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-2 transition-all disabled:opacity-75"
                  >
                    {aiLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Perguntar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAiPrompt("Sugira uma harmonização para pizza de calabresa especial.")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
                >
                  🍷 Harmonização Calabresa
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt("Escreva uma copy promocional para o Instagram divulgando pizza artesanal.")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
                >
                  📱 Copy Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setAiPrompt("Quais dicas para reduzir o tempo médio de forno em horário de pico?")}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
                >
                  ⚡ Eficiência da Cozinha
                </button>
              </div>
            </form>

            {/* AI Response Display Area */}
            {(aiLoading || aiResponse) && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 mt-2 max-h-60 overflow-y-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Bot className="w-4 h-4 text-red-600" />
                  <span>Resposta do Gemini IA:</span>
                </div>
                {aiLoading ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-slate-500 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                    <span>Consultando inteligência artificial...</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {aiResponse}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
