'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { DashboardEvent } from './types';

interface EventCarouselProps {
  events: DashboardEvent[];
}

export function EventCarousel({ events }: EventCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const distance = Math.max(
      280,
      Math.round(scrollRef.current.clientWidth * 0.75),
    );

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="flex min-w-0 flex-col justify-between space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900">
            Eventos da Imperial
          </h3>

          <p className="text-xs font-medium text-slate-500">
            Programação especial e treinamentos internos
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollEvents('left')}
            aria-label="Ver eventos anteriores"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollEvents('right')}
            aria-label="Ver próximos eventos"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">
              Nenhum evento cadastrado
            </p>
            <p className="text-xs text-slate-500">
              Os próximos eventos aparecerão aqui.
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 pt-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {events.map((event) => (
            <article
              key={event.id}
              className="flex w-[260px] min-w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-md"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              <div className="space-y-1 p-4">
                <h4 className="truncate text-xs font-bold text-white">
                  {event.title}
                </h4>

                <p className="line-clamp-2 text-[11px] text-slate-400">
                  {event.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}