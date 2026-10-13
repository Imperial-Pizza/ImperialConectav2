'use client';

import { EventCarousel } from './EventCarousel';
import { TopMontadores } from './TopMontadores';

import type { EventosSectionProps } from './types';

export default function EventosSection({
  events,
  topMontadores,
}: EventosSectionProps) {
  return (
    <section
      aria-label="Eventos e ranking de montadores"
      className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-12"
    >
      <EventCarousel events={events} />

      <TopMontadores montadores={topMontadores} />
    </section>
  );
}