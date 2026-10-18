'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Barcode,
  Building2,
  Calendar,
  Layers,
  Printer,
  Scale,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { formatCurrency } from '../../utils/format';
import type { Insumo } from '../../types';

interface EtiquetaInsumoModalProps {
  open: boolean;
  insumo: Insumo | null;
  onClose: () => void;
}

export function EtiquetaInsumoModal({
  open,
  insumo,
  onClose,
}: EtiquetaInsumoModalProps) {
  // Configurações personalizáveis para a etiqueta de insumo
  const hoje = new Date().toLocaleDateString('pt-BR');
  const [lote, setLote] = useState(() => `L-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`);
  const [dataRecebimento, setDataRecebimento] = useState(hoje);
  const [dataValidade, setDataValidade] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('pt-BR');
  });
  const [temperatura, setTemperatura] = useState('Local Seco e Arejado');
  const [responsavel, setResponsavel] = useState('Recepção de Estoque');

  if (!open || !insumo) return null;

  const totalItem = Number((insumo.qtd * insumo.custoUnitario).toFixed(2));

  const handlePrint = () => {
    window.print();
  };

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    Etiqueta Térmica de Insumo
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Identificação, Rastreabilidade & Validade
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulação Visual da Etiqueta Térmica (60x40mm) */}
            <div className="p-4 bg-slate-100/70 rounded-2xl flex justify-center">
              <div className="w-full max-w-sm bg-white border-2 border-dashed border-slate-300 p-5 rounded-xl shadow-md text-slate-900 space-y-3 font-mono print:border-none print:shadow-none">
                {/* Cabeçalho da Etiqueta */}
                <div className="border-b border-slate-900 pb-2 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest block text-slate-800">
                    IMPERIAL PIZZA • CONTROLE DE ESTOQUE
                  </span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-black mt-0.5">
                    {insumo.nome}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-0.5 text-[9px] text-slate-600">
                    <span>Cat: {insumo.categoria}</span>
                    <span>•</span>
                    <span>Cód: {insumo.codigo}</span>
                  </div>
                </div>

                {/* Bloco Central com Quantidade / Unidade */}
                <div className="grid grid-cols-2 gap-2 text-center py-1 border-b border-slate-900">
                  <div className="border-r border-slate-200 pr-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      QUANTIDADE
                    </span>
                    <p className="text-2xl font-black tracking-tight text-slate-900">
                      {insumo.qtd}{' '}
                      <span className="text-xs">{insumo.unidade}</span>
                    </p>
                    <span className="text-[8px] text-slate-400 block">
                      Mín: {insumo.min} {insumo.unidade}
                    </span>
                  </div>

                  <div className="pl-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      VALOR / UNID.
                    </span>
                    <p className="text-xl font-black tracking-tight text-slate-900">
                      {formatCurrency(insumo.custoUnitario)}
                    </p>
                    <span className="text-[8px] text-slate-500 block">
                      Total: {formatCurrency(totalItem)}
                    </span>
                  </div>
                </div>

                {/* Informações Sanitárias e Datas */}
                <div className="text-[10px] space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>LOTE:</span>
                    <strong className="text-black font-bold">{lote}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>RECEBIMENTO:</span>
                    <strong>{dataRecebimento}</strong>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>VALIDADE:</span>
                    <strong>{dataValidade}</strong>
                  </div>
                  {insumo.fornecedor && (
                    <div className="flex justify-between text-[9px] text-slate-700">
                      <span>FORNECEDOR:</span>
                      <span className="truncate max-w-[170px] font-semibold">{insumo.fornecedor}</span>
                    </div>
                  )}
                  {temperatura && (
                    <div className="flex justify-between text-[9px] text-blue-800">
                      <span>CONSERVAÇÃO:</span>
                      <span>{temperatura}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>RESPONSÁVEL:</span>
                    <span>{responsavel}</span>
                  </div>
                </div>

                {/* Código de barras visual */}
                <div className="pt-2 border-t border-slate-900 text-center space-y-1">
                  <div className="flex justify-center items-center gap-[2px] h-8 overflow-hidden px-4">
                    {[1, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 2, 3].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: `${(i % 3) + 1.5}px`,
                            height: '100%',
                          }}
                        />
                      )
                    )}
                  </div>
                  <span className="text-[9px] tracking-widest text-slate-700 block font-bold">
                    * {insumo.codigo}-{lote} *
                  </span>
                </div>
              </div>
            </div>

            {/* Ajustes rápidos de Validade & Lote */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Validade
                </label>
                <input
                  type="text"
                  value={dataValidade}
                  onChange={(e) => setDataValidade(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-indigo-500"
                  placeholder="DD/MM/AAAA"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Lote
                </label>
                <input
                  type="text"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-indigo-500"
                  placeholder="Código do Lote"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Padrão térmico 60x40mm (Zebra, Elgin, Argox)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
