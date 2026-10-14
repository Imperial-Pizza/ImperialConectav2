import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  isBaixo: boolean;
  compact?: boolean;
}

export function StatusBadge({ isBaixo, compact = false }: StatusBadgeProps) {
  const size = compact ? 'px-2 text-[9px]' : 'px-2.5 text-[10px]';

  if (isBaixo) {
    return (
      <span className={`inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 py-0.5 rounded-full font-bold ${size}`}>
        <AlertTriangle className="w-3 h-3" />
        {compact ? 'Baixo' : 'Estoque Baixo'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 py-0.5 rounded-full font-bold ${size}`}>
      <CheckCircle2 className="w-3 h-3" />
      Normal
    </span>
  );
}
