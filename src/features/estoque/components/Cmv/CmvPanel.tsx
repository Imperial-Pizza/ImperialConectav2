'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Layers,
  Package,
  Sparkles,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  ArrowRight,
  ShieldAlert,
  Percent,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BarChartIcon,
  AddMoneyCircleIcon,
} from '@hugeicons/core-free-icons';

import { formatCurrency, formatPercent } from '../../utils/format';
import { META_CMV } from '../../utils/constants';
import { CMV_PERIODOS_CONFIG } from '../../services/estoqueService';
import { MagicBento, MagicBentoCard } from '@/components/ui/MagicBento';
import type { UseCmvReturn } from '../../hooks/useCmv';
import type { UseEstoqueReturn } from '../../hooks/useEstoque';
import type { CmvPeriodoTipo, CmvValores } from '../../types';

interface CmvPanelProps {
  cmv: UseCmvReturn;
  estoque?: UseEstoqueReturn;
  onNavigateToEstoque?: () => void;
}

const PERIODOS_BOTOES: {
  tipo: CmvPeriodoTipo;
  label: string;
  badge: string;
  iconeTempo: string;
}[] = [
  { tipo: 'diario', label: 'Diário', badge: 'Hoje', iconeTempo: '24h' },
  { tipo: 'semanal', label: 'Semanal', badge: '7 dias', iconeTempo: '7d' },
  { tipo: 'quinzenal', label: 'A 15 Dias', badge: '15 dias', iconeTempo: '15d' },
  { tipo: 'mensal', label: 'Mensal', badge: '30 dias', iconeTempo: '30d' },
  { tipo: 'trimestral', label: 'Trimestral', badge: '90 dias', iconeTempo: '3m' },
  { tipo: 'anual', label: 'Anual', badge: '12 meses', iconeTempo: '1y' },
];

export function CmvPanel({ cmv, estoque, onNavigateToEstoque }: CmvPanelProps) {
  const {
    periodo,
    setPeriodo,
    valores,
    resultado,
    origem,
    puxarDoEstoqueReal,
    configPeriodo,
  } = cmv;

  const [mostrarFormula, setMostrarFormula] = useState(false);

  // Status visual do CMV
  const isCmvOtimo = resultado.cmvPercentual >= META_CMV.min && resultado.cmvPercentual <= META_CMV.max;
  const isCmvAbaixo = resultado.cmvPercentual < META_CMV.min;
  const isCmvCritico = resultado.cmvPercentual > META_CMV.max;

  const totalInsumosControle = estoque?.items?.length || 0;
  const valorTotalEstoqueFisico = estoque?.metrics?.valorTotal || valores.estoqueFinal;

  const handleSincronizarEstoque = () => {
    puxarDoEstoqueReal();
    toast.success('Valores de CMV sincronizados diretamente com o Controle de Estoque!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 1. Header com Seletor Interativo de Períodos */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
              <HugeiconsIcon icon={BarChartIcon} size={26} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Cálculo de CMV Global
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800">
                  {configPeriodo.nome}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Sincronizado c/ Estoque Real ({totalInsumosControle} insumos)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Valores Bloqueados
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {configPeriodo.subtitulo} •{' '}
                <button
                  type="button"
                  onClick={() => setMostrarFormula((p) => !p)}
                  className="text-red-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  {mostrarFormula ? 'Ocultar Fórmula' : 'Ver Fórmula de Cálculo'}
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSincronizarEstoque}
              title="Recalcular e sincronizar os valores diretamente com as movimentações dos insumos"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs shadow-emerald-600/20"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Sincronizar c/ Estoque Real</span>
            </button>

            {onNavigateToEstoque && (
              <button
                type="button"
                onClick={onNavigateToEstoque}
                title="Ir para o módulo de Controle de Estoque para editar insumos ou dar entrada/saída"
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Ir para Controle de Estoque</span>
              </button>
            )}
          </div>
        </div>

        {/* Banner Didático da Fórmula (Expansível) */}
        <AnimatePresence>
          {mostrarFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-red-400">
                  <span>CMV (Custo da Mercadoria Vendida)</span>
                  <span className="text-slate-400">Fórmula Clássica de Restaurante</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 font-mono text-center text-sm font-black text-amber-300">
                  CMV = Estoque Inicial + Compras do Período - Estoque Final
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mostra exatamente quanto de insumos saiu da sua despensa e câmaras frias para preparar as pizzas e pratos comercializados no intervalo selecionado.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de Seleção de Intervalos de Tempo (Diário, Semanal, 15 Dias, Mensal, Trimestral, Anual) */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Selecione a Janela de Apuração:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PERIODOS_BOTOES.map(({ tipo, label, badge, iconeTempo }) => {
              const ativo = periodo === tipo;
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setPeriodo(tipo)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    ativo
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/15 scale-[1.02]'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/90 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono ${
                        ativo ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {iconeTempo}
                    </span>
                    {ativo && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  </div>
                  <div>
                    <p className={`text-xs font-black ${ativo ? 'text-white' : 'text-slate-900'}`}>
                      {label}
                    </p>
                    <p className={`text-[10px] ${ativo ? 'text-slate-400' : 'text-slate-500'}`}>
                      {badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Magic Bento Grid do React Bits com BorderGlow e Spotlight Interativos */}
      <MagicBento
        columns={4}
        rowHeight={200}
        gap={14}
        radius={24}
        enableBorderGlow
        enableSpotlight
        spotlightRadius={300}
        clickEffect
        className="w-full"
      >
        {/* Card 1: Estoque Inicial */}
        <MagicBentoCard colSpan={1} enableBorderGlow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1. Ponto de Partida
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 my-auto">
            <p className="text-xs font-bold text-slate-600">Estoque Inicial</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {formatCurrency(valores.estoqueInicial)}
            </p>
            <p className="text-[10px] text-slate-400">Saldo no início do período</p>
          </div>
        </MagicBentoCard>

        {/* Card 2: Compras do Período */}
        <MagicBentoCard colSpan={1} enableBorderGlow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              2. Entradas & NFs
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 my-auto">
            <p className="text-xs font-bold text-slate-600">Compras no Período</p>
            <p className="text-2xl font-black text-blue-700 font-mono tracking-tight">
              + {formatCurrency(valores.comprasPeriodo)}
            </p>
            <p className="text-[10px] text-slate-400">Reposições com fornecedores</p>
          </div>
        </MagicBentoCard>

        {/* Card 3: Estoque Final */}
        <MagicBentoCard colSpan={1} enableBorderGlow>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. Contagem Física
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 my-auto">
            <p className="text-xs font-bold text-slate-600">Estoque Final</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              - {formatCurrency(valores.estoqueFinal)}
            </p>
            <p className="text-[10px] text-slate-400">Inventário atual em câmara/despensa</p>
          </div>
        </MagicBentoCard>

        {/* Card 4: CMV Apurado (Hero Card Escuro com Gradiente e Destaque) */}
        <MagicBentoCard
          colSpan={1}
          enableBorderGlow
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white border-slate-800 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Resultado Final
            </span>
            <div className="w-9 h-9 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <HugeiconsIcon icon={AddMoneyCircleIcon} size={20} strokeWidth={2} />
            </div>
          </div>
          <div className="space-y-1 my-auto">
            <p className="text-xs font-bold text-slate-300">CMV Apurado ({configPeriodo.nome})</p>
            <p className="text-2xl sm:text-3xl font-black text-red-400 font-mono tracking-tight">
              {formatCurrency(resultado.cmvGlobal)}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-400">Impacto s/ Vendas:</span>
              <strong
                className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                  isCmvOtimo
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {formatPercent(resultado.cmvPercentual)}
              </strong>
            </div>
          </div>
        </MagicBentoCard>
      </MagicBento>

      {/* 3. Área de Simulação de Valores e Diagnóstico Operacional */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Ajuste dos Valores do Período */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Valores do Período
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Ao Vivo do Estoque
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Bloqueado
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Valores calculados automaticamente a partir dos {totalInsumosControle} insumos do Controle de Estoque.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl">
              {configPeriodo.dias} {configPeriodo.dias === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cmv-estoqueInicial" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Estoque Inicial (R$)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Bloqueado
                </span>
              </label>
              <div className="relative">
                <input
                  id="cmv-estoqueInicial"
                  type="text"
                  readOnly
                  disabled
                  value={formatCurrency(valores.estoqueInicial)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 cursor-not-allowed select-none focus:outline-none"
                  title="Valor calculado automaticamente a partir do Controle de Estoque (bloqueado para edição direta)"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="cmv-comprasPeriodo" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>Compras no Período (R$)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Bloqueado
                </span>
              </label>
              <div className="relative">
                <input
                  id="cmv-comprasPeriodo"
                  type="text"
                  readOnly
                  disabled
                  value={formatCurrency(valores.comprasPeriodo)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 cursor-not-allowed select-none focus:outline-none"
                  title="Valor apurado a partir das compras do período (bloqueado para edição direta)"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="cmv-estoqueFinal" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Estoque Final (R$)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Bloqueado
                </span>
              </label>
              <div className="relative">
                <input
                  id="cmv-estoqueFinal"
                  type="text"
                  readOnly
                  disabled
                  value={formatCurrency(valores.estoqueFinal)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 cursor-not-allowed select-none focus:outline-none"
                  title="Saldo físico apurado a partir de todos os insumos cadastrados (bloqueado para edição direta)"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="cmv-faturamentoTotal" className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Faturamento Total ({configPeriodo.nome.split(' ')[0]})</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Bloqueado
                </span>
              </label>
              <div className="relative">
                <input
                  id="cmv-faturamentoTotal"
                  type="text"
                  readOnly
                  disabled
                  value={formatCurrency(valores.faturamentoTotal)}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 cursor-not-allowed select-none focus:outline-none"
                  title="Faturamento estimado proporcional ao período selecionado (bloqueado para edição direta)"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Dica de boas práticas & status de bloqueio */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Consistência entre contagens físicas:</span>
              <span className="font-bold text-slate-800">
                {configPeriodo.dias} {configPeriodo.dias === 1 ? 'dia monitorado' : 'dias monitorados'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Campos bloqueados. Qualquer alteração deve ser feita no <strong>Controle de Estoque</strong>.</span>
              </div>
              {onNavigateToEstoque && (
                <button
                  type="button"
                  onClick={onNavigateToEstoque}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Gerenciar Insumos</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Painel Direito: Diagnóstico & Indicadores com Status */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Diagnóstico & Indicadores
              </h2>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                  isCmvOtimo
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isCmvCritico
                    ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isCmvOtimo ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CMV Saudável</span>
                  </>
                ) : isCmvCritico ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CMV Elevado / Crítico</span>
                  </>
                ) : (
                  <>
                    <Percent className="w-3.5 h-3.5" />
                    <span>CMV Excelente / Baixo</span>
                  </>
                )}
              </span>
            </div>

            <div className="space-y-3">
              {/* % CMV */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-700">% do CMV sobre Faturamento</p>
                  <p className="text-[10px] text-slate-400">Parcela das vendas gasta com ingredientes</p>
                </div>
                <span
                  className={`text-base font-black font-mono px-3 py-1 rounded-xl ${
                    isCmvOtimo
                      ? 'text-emerald-700 bg-emerald-100/60'
                      : 'text-red-600 bg-red-100/60'
                  }`}
                >
                  {formatPercent(resultado.cmvPercentual)}
                </span>
              </div>

              {/* Margem Bruta */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-700">Margem de Contribuição Bruta</p>
                  <p className="text-[10px] text-slate-400">Sobra para custos fixos e lucro da pizzaria</p>
                </div>
                <span className="text-base font-black text-emerald-700 font-mono">
                  {formatCurrency(resultado.margemContribuicao)}
                </span>
              </div>

              {/* Barra de Meta Visual */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Faixa Operacional Ideal:</span>
                  <span className="font-mono text-slate-800">
                    {META_CMV.min}% a {META_CMV.max}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="w-[25%] bg-amber-400" title="Abaixo de 25%" />
                  <div className="w-[10%] bg-emerald-500" title="Faixa Ideal (25% - 30%)" />
                  <div className="flex-1 bg-red-400" title="Acima de 30%" />
                </div>
              </div>
            </div>
          </div>

          {/* Card de Orientação Estratégica */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              isCmvOtimo
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <p className="text-xs font-black flex items-center gap-1.5">
              {isCmvOtimo ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Operação Dentro da Margem de Sucesso</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Atenção: Margem Pressionada</span>
                </>
              )}
            </p>
            <p className="text-[11px] leading-relaxed">
              {isCmvOtimo
                ? `Seu CMV apurado de ${formatPercent(resultado.cmvPercentual)} está na faixa ideal (25% a 30%). O controle de pesagem e porcionamento está garantindo alta lucratividade.`
                : `Seu CMV apurado de ${formatPercent(resultado.cmvPercentual)} está fora da meta ideal (25% a 30%). Recomenda-se auditar pesagem de muçarela, fichas técnicas e desperdício de insumos.`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
