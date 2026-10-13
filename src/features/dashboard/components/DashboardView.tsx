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
import { Header } from '@/components/ui/header/Header';
import { WelcomeSection } from './welcome/WelcomeSection';
import BeneficiosSection from './Beneficios/BeneficiosSection';
import ModulesSection from './Modules/ModulesSection';
import { logout } from '@/components/ui/header/api/auth';

export default function DashboardView() {
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

  const [pontoStatus, setPontoStatus] = useState('Registrar Entrada');
  const [pontoLogs, setPontoLogs] = useState<{id: number, type: string, time: string, status: string}[]>([]);

  // Recent system notifications

  // Quadro de Avisos data positioned at the bottom
  const [notices, setNotices] = useState([
    { id: 1, tag: 'Urgente', title: 'ManutenÃ§Ã£o Preventiva do Forno 01', desc: 'Agendada para esta segunda-feira Ã s 06:00 antes da abertura da loja.', time: 'Hoje' },
    { id: 2, tag: 'Geral', title: 'Novo PadrÃ£o de Montagem de Pizzas', desc: 'Consultar o manual atualizado na aba de Treinamentos.', time: 'Ontem' },
    { id: 3, tag: 'Aviso', title: 'ReuniÃ£o de Alinhamento de Turno', desc: 'Sexta-feira Ã s 15:00 na sala de reuniÃµes principal.', time: 'HÃ¡ 2 dias' }
  ]);

  // System Logs data
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, user: 'Arthur Guilherme', action: 'LOGIN_SUCCESS', module: 'Auth', time: '14:32:10', ip: '192.168.1.45' },
    { id: 2, user: 'Mayrlon SÃ©rgio', action: 'UPDATE_KDS_STATUS', module: 'Cozinha', time: '14:20:15', ip: '192.168.1.12' },
    { id: 3, user: 'Valeria Souza', action: 'CREATE_COMANDA', module: 'Atendimento', time: '14:15:02', ip: '192.168.1.18' },
    { id: 4, user: 'Sistema', action: 'BACKUP_AUTOMATIC', module: 'Database', time: '14:00:00', ip: 'localhost' },
  ]);


  // Events carousel data
  const [events, setEvents] = useState([
    { id: 1, title: 'Treinamento de Forno', desc: 'CapacitaÃ§Ã£o avanÃ§ada da equipe de montagem.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60' },
    { id: 2, title: 'AniversÃ¡rio da Loja', desc: 'ComemoraÃ§Ã£o oficial com clientes e parceiros.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Sexta Musical', desc: 'Noite de mÃºsica ao vivo na Imperial Pizza.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60' }
  ]);

  // Top Montadores data
  const topMontadores = [
    { rank: 1, name: 'Mayrlon SÃ©rgio', role: 'Montador', count: '90 pizzas' },
    { rank: 2, name: 'Valeria Souza', role: 'Montador', count: '83 pizzas' },
    { rank: 3, name: 'Italo Sousa', role: 'Montador', count: '79 pizzas' },
    { rank: 4, name: 'Papa Adama', role: 'Montador', count: '66 pizzas' },
    { rank: 5, name: 'Osana TomÃ¡s', role: 'Montador', count: '60 pizzas' },
  ];

  const eventsScrollRef = useRef<HTMLDivElement>(null);

  const scrollEvents = (direction: 'left' | 'right') => {
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
      desc: newNoticeDesc || 'Novo aviso interno divulgado pela administraÃ§Ã£o.',
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
    if (pontoStatus === 'Registrar Entrada') setPontoStatus('Registrar SaÃ­da AlmoÃ§o');
    else if (pontoStatus === 'Registrar SaÃ­da AlmoÃ§o') setPontoStatus('Retorno AlmoÃ§o');
    else if (pontoStatus === 'Retorno AlmoÃ§o') setPontoStatus('Registrar SaÃ­da');
    else setPontoStatus('Ponto Encerrado');
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', desc: 'VisÃ£o geral da operaÃ§Ã£o e KPIs em tempo real', icon: LayoutDashboard, color: 'from-red-600 to-amber-500' },
    { id: 'atendimento', name: 'Atendimento', desc: 'GestÃ£o de mesas, salÃ£o e comandas ativas', icon: UtensilsCrossed, color: 'from-amber-500 to-orange-600' },
    { id: 'cozinha', name: 'Cozinha', desc: 'KDS, produÃ§Ã£o de pizzas e controle de forno', icon: ChefHat, color: 'from-red-700 to-red-500' },
    { id: 'estoque', name: 'Estoque', desc: 'Controle de massas, insumos e fornecedores', icon: Package, color: 'from-emerald-600 to-teal-600' },
    { id: 'financeiro', name: 'Financeiro', desc: 'Caixa diÃ¡rio, relatÃ³rios de vendas e faturamento', icon: DollarSign, color: 'from-blue-600 to-indigo-600' },
    { id: 'relatorios', name: 'RelatÃ³rios', desc: 'Indicadores gerenciais e mÃ©tricas avanÃ§adas', icon: BarChart3, color: 'from-purple-600 to-pink-600' },
    { id: 'logs', name: 'Logs do Sistema', desc: 'Auditoria de acessos e histÃ³rico de aÃ§Ãµes operacionais', icon: FileText, color: 'from-indigo-700 to-slate-800' },
    { id: 'ponto', name: 'Batida de Ponto', desc: 'Controle de jornada e registro de ponto da equipe', icon: Fingerprint, color: 'from-teal-600 to-emerald-700' },
    { id: 'administracao', name: 'AdministraÃ§Ã£o', desc: 'ConfiguraÃ§Ãµes do sistema, usuÃ¡rios e permissÃµes', icon: Settings, color: 'from-slate-700 to-slate-900' },
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
<Header
  activeModule={activeModule}
  notificationsOpen={notificationsOpen}
  userDropdownOpen={userDropdownOpen}
  onToggleNotifications={() =>
    setNotificationsOpen(!notificationsOpen)
  }
  onToggleUserDropdown={() =>
    setUserDropdownOpen(!userDropdownOpen)
  }
  onGoToHub={() => setActiveModule('hub')}
  onAddBenefit={() => {
    setUserDropdownOpen(false);
    setShowAddBenefitModal(true);
  }}
  onAddEvent={() => {
    setUserDropdownOpen(false);
    setShowAddEventModal(true);
  }}
  onAddNotice={() => {
    setUserDropdownOpen(false);
    setShowAddNoticeModal(true);
  }}
  onLogout={async () => {
    setUserDropdownOpen(false);
    try {
      await logout();
      window.location.href = '/'; // Redireciona após logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  }}
/>

      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-10">
        {/* Welcome Banner & Original User Profile Card Section */}
        <WelcomeSection />

            {/* SEÃ‡ÃƒO 1: CARROSSEL DE BENEFÃCIOS */}
<BeneficiosSection />

            {/* Hub Modules Grid with Search Input */}
<ModulesSection
  modules={modules}
  onSelectModule={setActiveModule}
/>

            {/* SEÃ‡ÃƒO 2: CARROSSEL DE EVENTOS & TOP MONTADORES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              
              {/* Event Carousel (span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Eventos da Imperial</h3>
                    <p className="text-xs text-slate-500 font-medium">ProgramaÃ§Ã£o especial e treinamentos internos</p>
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

              {/* Top Montadores do MÃªs (span-5) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Montadores</h3>
                    <p className="text-xs text-slate-500 font-medium">Ranking deste MÃªs</p>
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

            {/* SEÃ‡ÃƒO 3: QUADRO DE AVISOS (Bottom Session) */}
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
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 px-6 text-center text-xs text-slate-500 space-y-1 shadow-inner">
        <p className="font-bold text-slate-700">IMPERIAL PIZZA â€¢ SISTEMA DE OPERAÃ‡Ã•ES V4.0</p>
        <p>Â© 2026 Imperial Pizza. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}

