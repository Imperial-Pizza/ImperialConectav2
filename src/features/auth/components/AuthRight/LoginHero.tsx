'use client';

import { ShieldCheck, TrendingUp } from 'lucide-react';

interface LoginHeroProps {
  shineIndex: number;
}

export function LoginHero({ shineIndex }: LoginHeroProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent" />

      {/* React Bits Ambient Light Orb Effect */}
      <div
        className="absolute w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none transition-all duration-700"
        style={{
          top: `${20 + Math.sin(shineIndex * 0.1) * 15}%`,
          right: `${15 + Math.cos(shineIndex * 0.1) * 15}%`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-between p-16 w-full">
        {/* Version Badge */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Imperial V4.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight">
            Controle total <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
              da sua operação.
            </span>
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed font-light">
            O sistema operacional definitivo para alta gastronomia. Gestão de
            comandas, agilidade na produção e controle financeiro em tempo real.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            {/* Alta Velocidade */}
            <div className="space-y-1 transform hover:translate-y-[-2px] transition-transform">
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Alta Velocidade</span>

                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="text-xs text-slate-400 font-light">
                Sincronização imediata.
              </div>
            </div>

            {/* Gestão Focada */}
            <div className="space-y-1 transform hover:translate-y-[-2px] transition-transform">
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Gestão Focada</span>

                <ShieldCheck className="w-4 h-4 text-red-500" />
              </div>

              <div className="text-xs text-slate-400 font-light">
                Fluxo de trabalho contínuo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}