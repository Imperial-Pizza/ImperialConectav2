'use client';

import React, { useState } from 'react';
import { AppShell } from '@/layouts/AppShell';
import { SidebarTabs, SidebarTab } from '@/components/ui/SidebarTabs';
import { Target, TrendingUp, Award, CheckCircle, Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GoalsTab = 'minhas' | 'equipe' | 'concluidas';

const TABS: SidebarTab<GoalsTab>[] = [
  { id: 'minhas', label: 'Minhas Metas', icon: Target },
  { id: 'equipe', label: 'Metas da Loja / Equipe', icon: TrendingUp },
  { id: 'concluidas', label: 'Concluídas & Bônus', icon: Award },
];

export default function MetasPage() {
  const [goalsTab, setGoalsTab] = useState<GoalsTab>('minhas');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Tempo Médio de Forno < 6 minutos",
      category: "Operacional",
      targetValue: "6 min",
      currentValue: "5.4 min",
      progress: 95,
      status: "Em Andamento",
      reward: "Bônus de Produtividade Q3",
      deadline: "31/10/2026",
      assignedTo: "Equipe de Cozinha"
    },
    {
      id: 2,
      title: "Zero Desperdício de Massa Especial",
      category: "Qualidade",
      targetValue: "99% Aproveitamento",
      currentValue: "98.5%",
      progress: 98,
      status: "Quase Concluído",
      reward: "Folga Premiada + Cesta",
      deadline: "30/10/2026",
      assignedTo: "Arthur Guilherme"
    },
    {
      id: 3,
      title: "Índice de Satisfação do Cliente (CSAT)",
      category: "Atendimento",
      targetValue: "4.9 / 5.0",
      currentValue: "4.85",
      progress: 92,
      status: "Em Andamento",
      reward: "Destaque no Mural da Loja",
      deadline: "15/11/2026",
      assignedTo: "Salão & Atendimento"
    },
    {
      id: 4,
      title: "Conclusão de Treinamento de KDS Avançado",
      category: "Capacitação",
      targetValue: "100%",
      currentValue: "100%",
      progress: 100,
      status: "Concluído",
      reward: "Certificado Imperial OS",
      deadline: "01/10/2026",
      assignedTo: "Arthur Guilherme"
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Operacional',
    targetValue: '',
    reward: '',
    deadline: '',
    assignedTo: 'Arthur Guilherme'
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title) return;

    const created = {
      id: Date.now(),
      ...newGoal,
      currentValue: '0%',
      progress: 0,
      status: 'Iniciado'
    };

    setGoals([created, ...goals]);
    setNewGoal({ title: '', category: 'Operacional', targetValue: '', reward: '', deadline: '', assignedTo: 'Arthur Guilherme' });
    setShowNewGoalModal(false);
    setSuccessMsg('Meta cadastrada com sucesso!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <AppShell activeModule="metas">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-red-600/20">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Desempenho & OKRs</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">Q4 2026</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Central de Metas & Bonificações</h2>
                <p className="text-xs text-slate-500">Acompanhe suas metas operacionais, prazos e recompensas na Imperial Pizza</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewGoalModal(true)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Meta / OKR</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            <div className="lg:col-span-3 shrink-0">
              <SidebarTabs
                title="Filtros de Metas"
                tabs={TABS}
                activeTab={goalsTab}
                onChange={setGoalsTab}
              />
            </div>

            <div className="lg:col-span-9 space-y-4">
              <AnimatePresence mode="wait">
                {goalsTab === 'minhas' && (
                  <motion.div key="minhas" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-red-200 transition-all">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full">{goal.category}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${goal.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{goal.status}</span>
                          </div>
                          <h3 className="text-sm font-black text-slate-900">{goal.title}</h3>
                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div>
                              <span className="text-slate-400 font-semibold block">Alvo</span>
                              <span className="font-bold text-slate-800">{goal.targetValue}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-semibold block">Atual</span>
                              <span className="font-bold text-red-600">{goal.currentValue}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Progresso</span>
                            <span className="text-slate-900">{goal.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${goal.progress === 100 ? 'bg-emerald-500' : 'bg-red-600'}`} style={{ width: `${goal.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {goalsTab === 'equipe' && (
                  <motion.div key="equipe" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-red-200 transition-all">
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-0.5 rounded-full inline-block">Coletivo • {goal.assignedTo}</span>
                          <h3 className="text-sm font-black text-slate-900">{goal.title}</h3>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Atingimento Geral</span>
                            <span className="text-indigo-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${goal.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {goalsTab === 'concluidas' && (
                  <motion.div key="concluidas" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                    {goals.filter(g => g.progress === 100 || g.status === 'Concluído').map((goal) => (
                      <div key={goal.id} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full inline-block mb-1">Concluído com Sucesso</span>
                          <h4 className="text-sm font-bold text-slate-900">{goal.title}</h4>
                          <p className="text-xs text-slate-600">Recompensa: <strong className="text-emerald-700">{goal.reward}</strong></p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0 ml-4" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>

      {showNewGoalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Cadastrar Nova Meta / OKR</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título da Meta</label>
                <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({...newGoal, title: e.target.value})} placeholder="Ex: Reduzir tempo..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select value={newGoal.category} onChange={(e) => setNewGoal({...newGoal, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
                    <option value="Operacional">Operacional</option>
                    <option value="Qualidade">Qualidade</option>
                    <option value="Atendimento">Atendimento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alvo</label>
                  <input type="text" value={newGoal.targetValue} onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})} placeholder="Ex: 5 min" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recompensa</label>
                <input type="text" value={newGoal.reward} onChange={(e) => setNewGoal({...newGoal, reward: e.target.value})} placeholder="Ex: Bônus Q3" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prazo</label>
                <input type="text" value={newGoal.deadline} onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})} placeholder="Ex: 31/10/2026" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewGoalModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md">Salvar Meta</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppShell>
  );
}
