'use client';

import React from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Pizza,
  ShieldAlert,
} from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  isLoading: boolean;

  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onRememberMeChange: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleLogin: () => void;
}

export function LoginForm({
  email,
  password,
  showPassword,
  rememberMe,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onRememberMeChange,
  onSubmit,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 relative z-10 bg-white min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20 transform hover:scale-105 transition-transform duration-300">
            <Pizza className="w-7 h-7 text-white animate-pulse" />
          </div>

          <div>
            <span className="font-black text-xl tracking-wider text-slate-900">
              IMPERIAL
            </span>

            <span className="text-xs block text-red-600 font-bold tracking-widest uppercase">
              Pizza OS
            </span>
          </div>

        </div>

        {/* Denúncia Anônima */}
        <button
          type="button"
          onClick={() => {
            // window.location.href = '/denuncia';
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-sm cursor-not-allowed"
          style={{ cursor: 'not-allowed' }}
          title="Canal de Ética e Denúncia Anônima"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />

          <span className="hidden sm:inline">
            Denúncia Anônima
          </span>
        </button>
      </div>

      {/* Formulário */}
      <div className="w-full max-w-md mx-auto my-auto py-8">

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Acesse sua conta
          </h1>

          <p className="text-slate-500 text-sm">
            Insira suas credenciais para entrar no Imperial OS.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              E-mail
            </label>

            <div className="relative group">

              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="E-mail"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 hover:border-slate-300 transition-all text-sm font-medium autofill:shadow-[inset_0_0_0px_1000px_white] [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [-webkit-autofill]:[-webkit-text-fill-color:#0f172a]"
              />

            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between">

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Senha
              </label>

            </div>

            <div className="relative group">

              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                <Lock className="w-5 h-5" />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 hover:border-slate-300 transition-all text-sm font-medium autofill:shadow-[inset_0_0_0px_1000px_white] [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [-webkit-autofill]:[-webkit-text-fill-color:#0f172a]"
              />

              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>
          </div>

          {/* Lembrar-me */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 cursor-pointer select-none">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={onRememberMeChange}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600 accent-red-600 cursor-pointer"
              />

              <span className="text-slate-600 text-xs font-medium">
                Lembrar-me
              </span>

            </label>

          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all duration-200 group disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Entrar no Sistema</span>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Ou
              </span>
            </div>

          </div>

          {/* Google */}
          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full cursor-pointer py-3 px-4 bg-white  border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-200 text-sm shadow-sm"
          >

            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>

            <span>Continuar com o Google</span>

          </button>

        </form>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2 pt-6 border-t border-slate-100">

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">

          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span>
            IMPERIAL PIZZA • 2026
          </span>

        </div>

        <p className="text-xs text-slate-400">
          © 2026 Imperial Pizza. Todos os direitos reservados.
        </p>

      </div>

    </div>
  );
}