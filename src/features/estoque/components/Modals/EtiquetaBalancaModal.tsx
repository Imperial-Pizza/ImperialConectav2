'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Barcode,
  Calendar,
  Check,
  Printer,
  Scale,
  Sparkles,
  Thermometer,
  X,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { formatCurrency } from '../../utils/format';
import type { ProdutoPesado } from '../../types';

interface EtiquetaBalancaModalProps {
  open: boolean;
  item: ProdutoPesado | null;
  onClose: () => void;
}

export function EtiquetaBalancaModal({
  open,
  item,
  onClose,
}: EtiquetaBalancaModalProps) {
  if (!open || !item) return null;

  const totalPacote = Number((item.pesoUnitarioKg * item.custoPorKg).toFixed(2));

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
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Etiqueta de Balança / Lote
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Padrão térmico para identificação de bancada e ANVISA
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
                    IMPERIAL PIZZA • PRÉ-PREPARO
                  </span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-black mt-0.5">
                    {item.nome}
                  </h4>
                  <span className="text-[9px] text-slate-600 block">
                    Origem: {item.insumoOrigem}
                  </span>
                </div>

                {/* Bloco Central com Peso Gigante */}
                <div className="grid grid-cols-2 gap-2 text-center py-1 border-b border-slate-900">
                  <div className="border-r border-slate-200 pr-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      PESO LÍQUIDO
                    </span>
                    <p className="text-2xl font-black tracking-tight text-slate-900">
                      {item.pesoUnitarioKg.toFixed(3)}{' '}
                      <span className="text-xs">kg</span>
                    </p>
                    <span className="text-[8px] text-slate-400 block">
                      Tara: 0.020 kg
                    </span>
                  </div>

                  <div className="pl-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      TOTAL VALOR
                    </span>
                    <p className="text-xl font-black tracking-tight text-slate-900">
                      {formatCurrency(totalPacote)}
                    </p>
                    <span className="text-[8px] text-slate-500 block">
                      {formatCurrency(item.custoPorKg)} / kg
                    </span>
                  </div>
                </div>

                {/* Informações Sanitárias e Datas */}
                <div className="text-[10px] space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>LOTE:</span>
                    <strong className="text-black font-bold">{item.lote}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>FABRICAÇÃO:</span>
                    <strong>{item.dataPesagem}</strong>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>VALIDADE:</span>
                    <strong>{item.dataValidade}</strong>
                  </div>
                  {item.temperatura && (
                    <div className="flex justify-between text-[9px] text-blue-800">
                      <span>CONSERVAÇÃO:</span>
                      <span>{item.temperatura}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>RESPONSÁVEL:</span>
                    <span>{item.responsavel}</span>
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
                    * {item.codigo}-{item.lote} *
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Compatível com impressoras térmicas (ex: Zebra, Argox, Elgin)
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
