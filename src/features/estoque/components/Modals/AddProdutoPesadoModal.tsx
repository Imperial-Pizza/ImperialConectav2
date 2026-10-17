'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Boxes,
  Calendar,
  DollarSign,
  Scale,
  Sparkles,
  Thermometer,
  User,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { CATEGORIAS_PRODUTO_PESADO } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';
import type { NovoProdutoPesado, ProdutoPesado } from '../../types';

interface AddProdutoPesadoModalProps {
  open: boolean;
  initialData?: ProdutoPesado | null;
  insumosDisponiveis?: string[];
  onClose: () => void;
  onSubmit: (dados: NovoProdutoPesado) => Promise<unknown> | void;
}

export function AddProdutoPesadoModal({
  open,
  initialData,
  insumosDisponiveis = [
    'Muçarela em Peça (INS-002)',
    'Farinha de Trigo Especial (INS-001)',
    'Molho de Tomate Pelati (INS-003)',
    'Pepperoni Importado (INS-004)',
    'Peito de Frango Resfriado',
    'Calabresa Defumada Peça',
    'Manta de Bacon Defumada',
  ],
  onClose,
  onSubmit,
}: AddProdutoPesadoModalProps) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState<string>(CATEGORIAS_PRODUTO_PESADO[0]);
  const [insumoOrigem, setInsumoOrigem] = useState('');
  const [pesoUnitarioKg, setPesoUnitarioKg] = useState('5.0');
  const [quantidadePacotes, setQuantidadePacotes] = useState('5');
  const [pesoMinimoKg, setPesoMinimoKg] = useState('15');
  const [custoPorKg, setCustoPorKg] = useState('32.90');
  const [lote, setLote] = useState('');
  const [dataPesagem, setDataPesagem] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dataValidade, setDataValidade] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [rendimentoPercentual, setRendimentoPercentual] = useState('98');
  const [temperatura, setTemperatura] = useState('1°C a 4°C (Câmara Fria)');
  const [responsavel, setResponsavel] = useState('Equipe da Cozinha');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setCodigo(initialData.codigo);
      setCategoria(initialData.categoria);
      setInsumoOrigem(initialData.insumoOrigem);
      setPesoUnitarioKg(String(initialData.pesoUnitarioKg));
      setQuantidadePacotes(String(initialData.quantidadePacotes));
      setPesoMinimoKg(String(initialData.pesoMinimoKg));
      setCustoPorKg(String(initialData.custoPorKg));
      setLote(initialData.lote);
      setDataPesagem(initialData.dataPesagem);
      setDataValidade(initialData.dataValidade);
      setRendimentoPercentual(String(initialData.rendimentoPercentual || 98));
      setTemperatura(initialData.temperatura || '1°C a 4°C (Câmara Fria)');
      setResponsavel(initialData.responsavel);
      setObservacoes(initialData.observacoes || '');
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setNome('');
      setCodigo(`PES-${randomSuffix}`);
      setCategoria(CATEGORIAS_PRODUTO_PESADO[0]);
      setInsumoOrigem(insumosDisponiveis[0] || 'Muçarela em Peça');
      setPesoUnitarioKg('5.0');
      setQuantidadePacotes('6');
      setPesoMinimoKg('15');
      setCustoPorKg('32.90');
      setLote(`LT-${randomSuffix}`);
      setDataPesagem(new Date().toISOString().slice(0, 10));
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDataValidade(d.toISOString().slice(0, 10));
      setRendimentoPercentual('98');
      setTemperatura('1°C a 4°C (Câmara Fria)');
      setResponsavel('Equipe de Cozinha (Manhã)');
      setObservacoes('');
    }
  }, [initialData, open, insumosDisponiveis]);

  if (!open) return null;

  const numPesoUnit = parseFloat(pesoUnitarioKg) || 0;
  const numPacotes = parseInt(quantidadePacotes, 10) || 0;
  const numCusto = parseFloat(custoPorKg) || 0;
  const pesoTotalCalculado = Number((numPesoUnit * numPacotes).toFixed(2));
  const valorTotalCalculado = Number((pesoTotalCalculado * numCusto).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        codigo: codigo.trim() || `PES-${Date.now().toString().slice(-3)}`,
        nome: nome.trim(),
        categoria,
        insumoOrigem: insumoOrigem.trim(),
        pesoUnitarioKg: numPesoUnit,
        quantidadePacotes: numPacotes,
        pesoMinimoKg: parseFloat(pesoMinimoKg) || 0,
        custoPorKg: numCusto,
        dataPesagem,
        dataValidade,
        lote: lote.trim() || `LT-${Date.now().toString().slice(-4)}`,
        temperatura: temperatura.trim(),
        rendimentoPercentual: parseFloat(rendimentoPercentual) || 100,
        responsavel: responsavel.trim(),
        observacoes: observacoes.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 border border-slate-200 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {initialData ? 'Editar Produto Pesado' : 'Registrar Nova Pesagem / Fracionamento'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {initialData
                      ? 'Atualize os parâmetros e dados do lote pesado'
                      : 'Cadastre lotes de produtos pesados (ex: pacotes de 5kg de muçarela triturada)'}
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

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Código */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Código do Lote
                  </label>
                  <input
                    type="text"
                    required
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="PES-009"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Nome do Produto */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome do Produto Pesado
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Muçarela Triturada / Ralada (Saco 5kg)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categoria */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {CATEGORIAS_PRODUTO_PESADO.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Insumo de Origem */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Insumo de Origem Fracionado
                  </label>
                  <input
                    type="text"
                    required
                    value={insumoOrigem}
                    onChange={(e) => setInsumoOrigem(e.target.value)}
                    placeholder="Ex: Muçarela em Peça (INS-002)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Bloco de Balança & Fracionamento */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Configuração de Pesagem & Porções</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                      Peso por Pacote (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={pesoUnitarioKg}
                      onChange={(e) => setPesoUnitarioKg(e.target.value)}
                      placeholder="5.0"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                      Qtd de Pacotes
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={quantidadePacotes}
                      onChange={(e) => setQuantidadePacotes(e.target.value)}
                      placeholder="6"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                      Estoque Mínimo (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={pesoMinimoKg}
                      onChange={(e) => setPesoMinimoKg(e.target.value)}
                      placeholder="15"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Box de Pré-visualização de Peso Total */}
                <div className="bg-white p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-600">Total em Estoque calculado:</span>
                    <strong className="text-emerald-700 font-mono text-sm">
                      {pesoTotalCalculado} kg
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      ({numPacotes} pacotes de {numPesoUnit}kg)
                    </span>
                  </div>

                  <div className="font-mono text-slate-700 font-bold">
                    Custo Total: {formatCurrency(valorTotalCalculado)}
                  </div>
                </div>
              </div>

              {/* Custos e Lote Sanitário */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custo por Kg (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={custoPorKg}
                    onChange={(e) => setCustoPorKg(e.target.value)}
                    placeholder="32.90"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Código do Lote
                  </label>
                  <input
                    type="text"
                    required
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    placeholder="LT-MUC-2610A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Aproveitamento / Rend. (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="100"
                    value={rendimentoPercentual}
                    onChange={(e) => setRendimentoPercentual(e.target.value)}
                    placeholder="98"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Data da Pesagem
                  </label>
                  <input
                    type="date"
                    required
                    value={dataPesagem}
                    onChange={(e) => setDataPesagem(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Data de Validade (Etiqueta)
                  </label>
                  <input
                    type="date"
                    required
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Temperatura Recomendada
                  </label>
                  <input
                    type="text"
                    value={temperatura}
                    onChange={(e) => setTemperatura(e.target.value)}
                    placeholder="Ex: 1°C a 4°C (Câmara Fria)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Responsável / Operador
                  </label>
                  <input
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Ex: Matheus Cozinha"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações e Lâmina de Corte
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Triturado em lâmina 4mm, selado a vácuo para uso na praça de montagem."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none resize-none"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{initialData ? 'Salvar Alterações' : 'Confirmar Pesagem'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
