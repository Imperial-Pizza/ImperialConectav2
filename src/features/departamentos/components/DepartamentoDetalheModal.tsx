'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Hash,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import type { DepartamentoDetalhe } from '../types';

interface DepartamentoDetalheModalProps {
  open: boolean;
  departamento: DepartamentoDetalhe | null;
  isLoading: boolean;
  onClose: () => void;
}

export function DepartamentoDetalheModal({
  open,
  departamento,
  isLoading,
  onClose,
}: DepartamentoDetalheModalProps) {
  if (!open || !departamento) return null;

  const pessoas = departamento.pessoas || [];

  return (
    <Portal>
      <AnimatePresence>
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[88vh] flex flex-col gap-6"
          >
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                      {departamento.nome}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {departamento.codigo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {departamento.descricao || 'Setor operacional da Imperial Pizza'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar detalhes"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resumo do Setor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                  Gestor Responsável
                </span>
                <p className="font-bold text-slate-900 truncate">
                  {departamento.gestor || 'Não definido'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-amber-600" />
                  Centro de Custo
                </span>
                <p className="font-mono font-bold text-slate-900 truncate">
                  {departamento.centroCusto || 'Não informado'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  E-mail do Setor
                </span>
                <p className="font-semibold text-blue-600 truncate" title={departamento.email}>
                  {departamento.email || 'Não informado'}
                </p>
              </div>
            </div>

            {/* Lista de Colaboradores Vinculados */}
            <div className="flex-1 min-h-0 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Colaboradores Vinculados ({departamento.colaboradoresCount})</span>
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  </div>
                ) : pessoas.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-700">
                      Nenhum colaborador vinculado a este departamento
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Os colaboradores alocados neste setor aparecerão listados aqui.
                    </p>
                  </div>
                ) : (
                  pessoas.map((pessoa) => (
                    <div
                      key={pessoa.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {pessoa.avatar || pessoa.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-black text-slate-900 truncate">
                              {pessoa.nome}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                pessoa.active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {pessoa.active ? 'Ativo' : 'Inativo'}
                            </span>
                            {pessoa.hasUser && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                {pessoa.role}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {pessoa.cargo || 'Colaborador'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 shrink-0">
                        {pessoa.telefone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {pessoa.telefone}
                          </span>
                        )}
                        {pessoa.email && (
                          <a
                            href={`mailto:${pessoa.email}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline truncate max-w-[180px]"
                            title={pessoa.email}
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{pessoa.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}

