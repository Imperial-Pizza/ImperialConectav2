'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pizza, 
  Sparkles, 
  Clock,
  ArrowRight,
  LogOut,
  CheckCircle2,
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bell,
  FileText,
  Fingerprint,
  Megaphone
} from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState('hub');
  const [shineIndex, setShineIndex] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');
  
  // Modals state for adding items via dropdown
  const [showAddBenefitModal, setShowAddBenefitModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);

  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newBenefitDesc, setNewBenefitDesc] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');

  // Ponto state for Batida de Ponto module
  const [pontoStatus, setPontoStatus] = useState('Registrar Entrada');
  const [pontoLogs, setPontoLogs] = useState([
    { id: 1, type: 'Entrada', time: '08:00 - Hoje', status: 'Confirmado' },
    { id: 2, type: 'Saída Almoço', time: '12:00 - Hoje', status: 'Confirmado' },
    { id: 3, type: 'Retorno Almoço', time: '13:00 - Hoje', status: 'Confirmado' },
  ]);

  const user = {
    name: 'Arthur Guilherme Ribeiro Duarte',
    email: 'arthurnexora@gmail.com',
    role: 'Administrador Geral / Coordenador de Tecnologia',
    avatar: 'A',
    lastAccess: 'Hoje, 14:32'
  };

  // Recent system notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Atualização do KDS v4.2', time: 'Há 10 min', desc: 'Melhorias de desempenho no tempo de forno e comandas.' },
    { id: 2, title: 'Fechamento de Caixa', time: 'Há 1 hora', desc: 'Caixa diário encerrado com sucesso pelo gerente de turno.' },
    { id: 3, title: 'Novo Insumo Cadastrado', time: 'Há 3 horas', desc: 'Farinha especial italiana adicionada ao estoque principal.' }
  ]);

  // Quadro de Avisos data positioned at the bottom
  const [notices, setNotices] = useState([
    { id: 1, tag: 'Urgente', title: 'Manutenção Preventiva do Forno 01', desc: 'Agendada para esta segunda-feira às 06:00 antes da abertura da loja.', time: 'Hoje' },
    { id: 2, tag: 'Geral', title: 'Novo Padrão de Montagem de Pizzas', desc: 'Consultar o manual atualizado na aba de Treinamentos.', time: 'Ontem' },
    { id: 3, tag: 'Aviso', title: 'Reunião de Alinhamento de Turno', desc: 'Sexta-feira às 15:00 na sala de reuniões principal.', time: 'Há 2 dias' }
  ]);

  // System Logs data
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, user: 'Arthur Guilherme', action: 'LOGIN_SUCCESS', module: 'Auth', time: '14:32:10', ip: '192.168.1.45' },
    { id: 2, user: 'Mayrlon Sérgio', action: 'UPDATE_KDS_STATUS', module: 'Cozinha', time: '14:20:15', ip: '192.168.1.12' },
    { id: 3, user: 'Valeria Souza', action: 'CREATE_COMANDA', module: 'Atendimento', time: '14:15:02', ip: '192.168.1.18' },
    { id: 4, user: 'Sistema', action: 'BACKUP_AUTOMATIC', module: 'Database', time: '14:00:00', ip: 'localhost' },
  ]);

  // Benefits data with custom gradients
  const [benefits, setBenefits] = useState([
    { id: 1, title: 'Atendimento Ágil', desc: 'Foco total na experiência com comandas digitais e suporte contínuo.', gradient: 'from-blue-600 via-indigo-600 to-violet-600', icon: UtensilsCrossed },
    { id: 2, title: 'KDS & Forno Inteligente', desc: 'Controle de tempo de forno e produção de pizzas em tempo real.', gradient: 'from-red-600 via-rose-600 to-orange-500', icon: ChefHat },
    { id: 3, title: 'Gestão de Estoque', desc: 'Rastreabilidade completa de insumos, massas e fornecedores.', gradient: 'from-emerald-600 via-teal-600 to-cyan-600', icon: Package },
    { id: 4, title: 'Controle Financeiro', desc: 'Caixa diário, relatórios detalhados e faturamento automatizado.', gradient: 'from-amber-500 via-orange-600 to-red-600', icon: DollarSign },
  ]);

  // Events carousel data
  const [events, setEvents] = useState([
    { id: 1, title: 'Treinamento de Forno', desc: 'Capacitação avançada da equipe de montagem.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Aniversário da Loja', desc: 'Comemoração oficial com clientes e parceiros.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Sexta Musical', desc: 'Noite de música ao vivo na Imperial Pizza.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' }
  ]);

  // Top Montadores data
  const topMontadores = [
    { rank: 1, name: 'Mayrlon Sérgio', role: 'Montador', count: '90 pizzas' },
    { rank: 2, name: 'Valeria Souza', role: 'Montador', count: '83 pizzas' },
    { rank: 3, name: 'Italo Sousa', role: 'Montador', count: '79 pizzas' },
    { rank: 4, name: 'Papa Adama', role: 'Montador', count: '66 pizzas' },
    { rank: 5, name: 'Osana Tomás', role: 'Montador', count: '60 pizzas' },
  ];

  const benefitsScrollRef = useRef(null);
  const eventsScrollRef = useRef(null);

  const scrollBenefits = (direction) => {
    if (benefitsScrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = benefitsScrollRef.current;
      const scrollAmount = clientWidth / 2;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          benefitsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          benefitsScrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
        }
      } else {
        benefitsScrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const scrollEvents = (direction) => {
    if (eventsScrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = eventsScrollRef.current;
      const scrollAmount = 280;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          eventsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          eventsScrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
        }
      } else {
        eventsScrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);

    const autoScrollInterval = setInterval(() => {
      scrollBenefits('right');
      scrollEvents('right');
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(autoScrollInterval);
    };
  }, []);

  const handleAddBenefit = (e) => {
    e.preventDefault();
    if (!newBenefitTitle) return;
    const gradients = [
      'from-purple-600 via-indigo-600 to-blue-600',
      'from-pink-600 via-rose-600 to-red-600',
      'from-amber-500 via-yellow-600 to-emerald-600'
    ];
    setBenefits([...benefits, {
      id: Date.now(),
      title: newBenefitTitle,
      desc: newBenefitDesc || 'Novo benefício cadastrado no sistema.',
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      icon: Sparkles
    }]);
    setNewBenefitTitle('');
    setNewBenefitDesc('');
    setShowAddBenefitModal(false);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle) return;
    setEvents([...events, {
      id: Date.now(),
      title: newEventTitle,
      desc: newEventDesc || 'Novo evento operacional programado.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60'
    }]);
    setNewEventTitle('');
    setNewEventDesc('');
    setShowAddEventModal(false);
  };

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!newNoticeTitle) return;
    setNotices([{
      id: Date.now(),
      tag: 'Aviso',
      title: newNoticeTitle,
      desc: newNoticeDesc || 'Novo aviso interno divulgado pela administração.',
      time: 'Agora'
    }, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeDesc('');
    setShowAddNoticeModal(false);
  };

  const handleRegistrarPonto = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - Hoje';
    const newLog = {
      id: Date.now(),
      type: pontoStatus,
      time: timeStr,
      status: 'Registrado com Sucesso'
    };
    setPontoLogs([newLog, ...pontoLogs]);
    if (pontoStatus === 'Registrar Entrada') setPontoStatus('Registrar Saída Almoço');
    else if (pontoStatus === 'Registrar Saída Almoço') setPontoStatus('Retorno Almoço');
    else if (pontoStatus === 'Retorno Almoço') setPontoStatus('Registrar Saída');
    else setPontoStatus('Ponto Encerrado');
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', desc: 'Visão geral da operação e KPIs em tempo real', icon: LayoutDashboard, color: 'from-red-600 to-amber-500' },
    { id: 'atendimento', name: 'Atendimento', desc: 'Gestão de mesas, salão e comandas ativas', icon: UtensilsCrossed, color: 'from-amber-500 to-orange-600' },
    { id: 'cozinha', name: 'Cozinha', desc: 'KDS, produção de pizzas e controle de forno', icon: ChefHat, color: 'from-red-700 to-red-500' },
    { id: 'estoque', name: 'Estoque', desc: 'Controle de massas, insumos e fornecedores', icon: Package, color: 'from-emerald-600 to-teal-600' },
    { id: 'financeiro', name: 'Financeiro', desc: 'Caixa diário, relatórios de vendas e faturamento', icon: DollarSign, color: 'from-blue-600 to-indigo-600' },
    { id: 'relatorios', name: 'Relatórios', desc: 'Indicadores gerenciais e métricas avançadas', icon: BarChart3, color: 'from-purple-600 to-pink-600' },
    { id: 'logs', name: 'Logs do Sistema', desc: 'Auditoria de acessos e histórico de ações operacionais', icon: FileText, color: 'from-indigo-700 to-slate-800' },
    { id: 'ponto', name: 'Batida de Ponto', desc: 'Controle de jornada e registro de ponto da equipe', icon: Fingerprint, color: 'from-teal-600 to-emerald-700' },
    { id: 'administracao', name: 'Administração', desc: 'Configurações do sistema, usuários e permissões', icon: Settings, color: 'from-slate-700 to-slate-900' },
  ];

  const filteredModules = modules.filter(mod => 
    mod.name.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
    mod.desc.toLowerCase().includes(moduleSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* React Bits Ambient Light Orb Effect */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-red-600/5 blur-[120px] pointer-events-none transition-all duration-700"
        style={{ 
          top: `${10 + Math.sin(shineIndex * 0.08) * 10}%`, 
          left: `${20 + Math.cos(shineIndex * 0.08) * 10}%` 
        }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full bg-amber-500/5 blur-[140px] pointer-events-none transition-all duration-700"
        style={{ 
          bottom: `${10 + Math.cos(shineIndex * 0.08) * 10}%`, 
          right: `${20 + Math.sin(shineIndex * 0.08) * 10}%` 
        }}
      />

      {/* Header section matching max-w-7xl and horizontal padding */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModule('hub')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-slate-900">IMPERIAL</span>
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">PIZZA OS</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Sistema Integrado de Operações</span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {activeModule !== 'hub' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModule('hub')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2"
              >
                <span>Voltar ao Hub Central</span>
              </motion.button>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-all shadow-sm"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 overflow-hidden"
                  >
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Atualizações Recentes</p>
                      <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200">3 novas</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.avatar}
                </div>
                <span className="text-xs font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { setUserDropdownOpen(false); setShowAddBenefitModal(true); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-red-600" />
                      <span>Adicionar Carrossel Benefício</span>
                    </button>
                    <button 
                      onClick={() => { setUserDropdownOpen(false); setShowAddEventModal(true); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Adicionar Carrossel Evento</span>
                    </button>
                    <button 
                      onClick={() => { setUserDropdownOpen(false); setShowAddNoticeModal(true); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Megaphone className="w-4 h-4 text-blue-600" />
                      <span>Novo Aviso</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button 
                      onClick={() => { setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Deslogar</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-10">
        
        {activeModule === 'hub' ? (
          <>
            {/* Welcome Banner & Original User Profile Card Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left: Welcome Banner */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-800"
              >
                <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ambiente Operacional Ativo</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    Bem-vindo de volta, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">{user.name.split(' ')[0]}</span>!
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                    Selecione abaixo o módulo desejado para gerenciar as operações da Imperial Pizza com agilidade e total controle em tempo real.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-4 text-xs text-slate-400 relative z-10 border-t border-slate-800 mt-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Último acesso: {user.lastAccess}</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: Original User Profile Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-600/20">
                    {user.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-3 py-3 border-y border-slate-100">
                  <div className="text-[11px] text-slate-500 flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-400">Função:</span>
                    <span className="font-bold text-slate-800">{user.role}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between items-center">
                    <span className="font-semibold text-slate-400">Status da Conta:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                    </span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400">
                  Imperial Pizza OS • Painel Administrativo Seguro
                </div>
              </motion.div>

            </div>

            {/* SEÇÃO 1: CARROSSEL DE BENEFÍCIOS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">React Bits Showcase</span>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">Pilares da Excelência Operacional</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scrollBenefits('left')}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => scrollBenefits('right')}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Benefits Horizontal Scroll Container */}
              <div 
                ref={benefitsScrollRef}
                className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none' }}
              >
                {benefits.map((item) => {
                  const IconComp = item.icon || Sparkles;
                  return (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -4 }}
                      className={`min-w-[320px] sm:min-w-[380px] h-44 rounded-3xl bg-gradient-to-br ${item.gradient} p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden shrink-0`}
                    >
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-start justify-between relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                          <IconComp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          Destaque
                        </span>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
                        <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Hub Modules Grid with Search Input */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Módulos do Sistema</h2>
                  <span className="text-xs text-slate-500 font-medium">{filteredModules.length} de {modules.length} módulos disponíveis</span>
                </div>
                
                <div className="relative w-full sm:w-72">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    placeholder="Pesquisar módulos..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 shadow-sm transition-all"
                  />
                </div>
              </div>

              {filteredModules.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-800">Nenhum módulo encontrado</p>
                  <p className="text-xs text-slate-500">Tente buscar por outro termo no campo de pesquisa acima.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((mod, index) => {
                    const IconComp = mod.icon;
                    return (
                      <motion.div
                        key={mod.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveModule(mod.id)}
                        className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-6 group"
                      >
                        <div className="space-y-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.color} text-white flex items-center justify-center shadow-md shadow-red-600/10 group-hover:scale-110 transition-transform`}>
                            <IconComp className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {mod.name}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal">
                              {mod.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="text-red-600">Acessar módulo</span>
                          <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEÇÃO 2: CARROSSEL DE EVENTOS & TOP MONTADORES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              
              {/* Event Carousel (span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Eventos da Imperial</h3>
                    <p className="text-xs text-slate-500 font-medium">Programação especial e treinamentos internos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => scrollEvents('left')}
                      className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => scrollEvents('right')}
                      className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div 
                  ref={eventsScrollRef}
                  className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {events.map((ev) => (
                    <div 
                      key={ev.id}
                      className="min-w-[260px] max-w-[260px] bg-slate-900 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between shrink-0 border border-slate-800"
                    >
                      <div className="h-32 relative overflow-hidden">
                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-bold text-white text-xs truncate">{ev.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{ev.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Montadores do Mês (span-5) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Montadores</h3>
                    <p className="text-xs text-slate-500 font-medium">Ranking deste Mês</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {topMontadores.map((m) => (
                    <div key={m.rank} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          m.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                          m.rank === 2 ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          m.rank === 3 ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {m.rank}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-xl border border-red-100">
                        {m.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SEÇÃO 3: QUADRO DE AVISOS (Bottom Session) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-inner">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Quadro de Avisos da Imperial Pizza</h3>
                    <p className="text-xs text-slate-500">Comunicados oficiais e avisos importantes para a equipe e colaboradores</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notices.map(notice => (
                  <div key={notice.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-red-200 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          notice.tag === 'Urgente' ? 'bg-red-50 text-red-600 border-red-200' :
                          notice.tag === 'Geral' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {notice.tag}
                        </span>
                        <span className="text-[10px] text-slate-400">{notice.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{notice.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : activeModule === 'logs' ? (
          /* Logs Module View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Auditoria</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Logs do Sistema</h2>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all shadow-sm"
                >
                  Voltar ao Hub
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">Registro em tempo real de acessos, modificações e auditorias de segurança na Imperial Pizza.</p>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3.5">Usuário / Sistema</th>
                        <th className="p-3.5">Ação Realizada</th>
                        <th className="p-3.5">Módulo</th>
                        <th className="p-3.5">Horário</th>
                        <th className="p-3.5">Endereço IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {systemLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{log.user}</td>
                          <td className="p-3.5 font-mono text-indigo-600">{log.action}</td>
                          <td className="p-3.5 text-slate-600">{log.module}</td>
                          <td className="p-3.5 text-slate-500">{log.time}</td>
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeModule === 'ponto' ? (
          /* Batida de Ponto Module View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shadow-inner">
                    <Fingerprint className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Recursos Humanos</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Batida de Ponto Digital</h2>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all shadow-sm"
                >
                  Voltar ao Hub
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-900 to-emerald-900 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full">Terminal Seguro</span>
                    <h3 className="text-xl font-black">Controle de Jornada</h3>
                    <p className="text-xs text-slate-300">Registre sua entrada, intervalos e saída com total conformidade trabalhista.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-3">
                    <p className="text-xs text-teal-200 font-bold">Status Atual:</p>
                    <p className="text-lg font-black">{pontoStatus}</p>
                    <button 
                      onClick={handleRegistrarPonto}
                      disabled={pontoStatus === 'Ponto Encerrado'}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                    >
                      {pontoStatus === 'Ponto Encerrado' ? 'Jornada Finalizada' : 'Confirmar Ponto Agora'}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Registros de Ponto de Hoje</h3>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="p-3.5">Tipo de Registro</th>
                          <th className="p-3.5">Horário</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pontoLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900">{log.type}</td>
                            <td className="p-3.5 text-slate-600">{log.time}</td>
                            <td className="p-3.5 text-emerald-600 font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Module View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-inner">
                    <Pizza className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Módulo Ativo</span>
                    <h2 className="text-2xl font-black text-slate-900 capitalize mt-1">{activeModule}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all shadow-sm"
                >
                  Voltar para o Hub
                </button>
              </div>

              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900">Módulo {activeModule} Carregado com Sucesso</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Este ambiente está conectado ao ecossistema da Imperial Pizza. Todos os dados e registros deste módulo estão sincronizados em tempo real.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setActiveModule('hub')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20"
                  >
                    Retornar ao Hub de Módulos
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-6 text-center text-xs text-slate-500 space-y-1 shadow-inner">
        <p className="font-bold text-slate-700">IMPERIAL PIZZA • SISTEMA DE OPERAÇÕES V4.0</p>
        <p>© 2026 Imperial Pizza. Todos os direitos reservados.</p>
      </footer>

      {/* Modal: Adicionar Benefício */}
      {showAddBenefitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Adicionar Benefício ao Carrossel</h3>
            <form onSubmit={handleAddBenefit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Benefício</label>
                <input 
                  type="text" 
                  value={newBenefitTitle} 
                  onChange={(e) => setNewBenefitTitle(e.target.value)}
                  placeholder="Ex: Entrega Expressa" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <textarea 
                  value={newBenefitDesc} 
                  onChange={(e) => setNewBenefitDesc(e.target.value)}
                  placeholder="Explique o benefício..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBenefitModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Adicionar</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Adicionar Evento */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Adicionar Evento à Programação</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Evento</label>
                <input 
                  type="text" 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Ex: Workshop de Massas" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <textarea 
                  value={newEventDesc} 
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Detalhes do evento..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddEventModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Adicionar Evento</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Adicionar Aviso no Quadro */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Publicar Novo Aviso</h3>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Aviso</label>
                <input 
                  type="text" 
                  value={newNoticeTitle} 
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="Ex: Manutenção Preventiva" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição do Comunicado</label>
                <textarea 
                  value={newNoticeDesc} 
                  onChange={(e) => setNewNoticeDesc(e.target.value)}
                  placeholder="Detalhes do aviso..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600 h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddNoticeModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Publicar</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
