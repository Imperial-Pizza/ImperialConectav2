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
          onClick={() => {
            window.location.href = '/denuncia';
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 shadow-sm hover:shadow"
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
                placeholder="usuario3@imperial.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all text-sm font-medium"
              />

            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">

            <div className="flex items-center justify-between">

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Senha
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    'Instruções de redefinição enviadas para seu e-mail.'
                  );
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                Esqueceu a senha?
              </a>

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
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all text-sm font-medium"
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
                className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-red-600 focus:ring-red-600/20"
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
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all duration-200 group disabled:opacity-75"
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
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-200 text-sm shadow-sm"
          >

            <svg className="w-4 h-4" viewBox="0 0 24 24">

              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
              />

              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9C2.2-2 3.7-5 3.7-8.8z"
              />

              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
              />

              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
              />

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