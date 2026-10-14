export type AvisoTag = 'Urgente' | 'Geral' | 'Atenção';

export interface Aviso {
  id: string | number;
  tag: AvisoTag;
  time: string;
  title: string;
  desc: string;
}

export interface AvisosSectionProps {
  notices?: Aviso[];
}