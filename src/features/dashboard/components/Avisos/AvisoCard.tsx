import type { Aviso, AvisoTag } from './types';

interface AvisoCardProps {
  notice: Aviso;
}

const tagStyles: Record<AvisoTag, string> = {
  Urgente: 'border-red-200 bg-red-50 text-red-600',
  Geral: 'border-indigo-200 bg-indigo-50 text-indigo-600',
  Atenção: 'border-amber-200 bg-amber-50 text-amber-600',
};

export function AvisoCard({ notice }: AvisoCardProps) {
  return (
    <article className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 transition-colors hover:border-red-200">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
              tagStyles[notice.tag]
            }`}
          >
            {notice.tag}
          </span>

          <time className="shrink-0 text-[10px] text-slate-400">
            {notice.time}
          </time>
        </div>

        <h4 className="text-sm font-bold text-slate-900">
          {notice.title}
        </h4>

        <p className="text-xs leading-relaxed text-slate-600">
          {notice.desc}
        </p>
      </div>
    </article>
  );
}