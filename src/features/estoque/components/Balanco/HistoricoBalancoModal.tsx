'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, FileSpreadsheet, History, User, X } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import type { HistoricoBalanco } from '../../types';

interface HistoricoBalancoModalProps {
  open: boolean;
  historico: HistoricoBalanco[];
  onClose: () => void;
}

export function HistoricoBalancoModal({
  open,
  historico,
  onClose,
}: HistoricoBalancoModalProps) {
  const [selectedBalanco, setSelectedBalanco] = useState<HistoricoBalanco | null>(
    historico[0] || null
  );

  if (!open) return null;

  const handleExportBalancoCsv = (b: HistoricoBalanco) => {
    const headers = [
      'Código',
      'Insumo',
      'Unidade',
      'Estoque Sistema',
      'Contagem Física',
      'Divergência Qtd',
      'Divergência R$',
      'Motivo / Justificativa',
    ];

    const rows = b.itens.map((item) => [
      item.codigo,
      `"${item.nome.replace(/"/g, '""')}"`,
      item.unidade,
      item.qtdSistema.toString(),
      item.qtdFisica.toString(),
      item.divergenciaQtd.toString(),
      item.divergenciaValor.toFixed(2),
      `"${(item.motivo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balanco_estoque_${b.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeItem = selectedBalanco || historico[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Histórico de Balanços de Estoque
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Auditorias anteriores registradas e sincronizadas
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[400px]">
            {/* Lista Lateral de Balanços */}
            <div className="w-full md:w-80 border-r border-slate-100 overflow-y-auto divide-y divide-slate-100 bg-slate-50/30">
              {historico.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-400">Nenhum balanço registrado ainda</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Quando você finalizar um balanço, ele aparecerá aqui com todo o relatório de auditoria.
                  </p>
                </div>
              ) : (
                historico.map((b) => {
                  const isSelected = activeItem?.id === b.id;
                  const dataFormatada = new Date(b.dataHora).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  });

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBalanco(b)}
                      className={`w-full text-left p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50/70 border-l-4 border-red-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-slate-900">{b.id}</span>
                        <span
                          className={`font-black text-[11px] ${
                            b.impactoFinanceiroTotal < 0
                              ? 'text-red-600'
                              : b.impactoFinanceiroTotal > 0
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {b.impactoFinanceiroTotal < 0
                            ? `- ${formatCurrency(Math.abs(b.impactoFinanceiroTotal))}`
                            : formatCurrency(b.impactoFinanceiroTotal)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{dataFormatada}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{b.responsavel}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Detalhes do Balanço Selecionado */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {activeItem ? (
                <>
                  <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {activeItem.id}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {new Date(activeItem.dataHora).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Auditor: <strong>{activeItem.responsavel}</strong> • {activeItem.totalItensContados} itens conferidos ({activeItem.totalItensDivergentes} divergências)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExportBalancoCsv(activeItem)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>

                  {/* Tabela de Itens */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                          <tr>
                            <th className="p-3">Insumo</th>
                            <th className="p-3">Sistema</th>
                            <th className="p-3">Físico</th>
                            <th className="p-3">Diferença</th>
                            <th className="p-3">Motivo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeItem.itens.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className="font-bold text-slate-900">{item.nome}</span>
                                <span className="ml-2 font-mono text-[10px] text-slate-400">
                                  {item.codigo}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-600">
                                {item.qtdSistema} {item.unidade}
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {item.qtdFisica} {item.unidade}
                              </td>
                              <td className="p-3 font-mono">
                                <span
                                  className={`font-black ${
                                    item.divergenciaQtd < 0
                                      ? 'text-red-600'
                                      : item.divergenciaQtd > 0
                                      ? 'text-amber-600'
                                      : 'text-emerald-600'
                                  }`}
                                >
                                  {item.divergenciaQtd > 0
                                    ? `+${item.divergenciaQtd}`
                                    : item.divergenciaQtd}{' '}
                                  {item.unidade}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 italic">
                                {item.motivo || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                  Selecione um balanço à esquerda para visualizar os detalhes
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
