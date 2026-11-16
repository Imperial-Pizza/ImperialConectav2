'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/features/auth/apis/authApi';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Pizza, ShieldAlert } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let active = true;

    async function validate() {
      if (!token || !email) {
        if (active) {
          setValidationError('Link de redefinição incompleto ou inválido.');
          setTokenValid(false);
          setIsValidating(false);
        }
        return;
      }

      try {
        await authApi.verifyResetToken(email, token);
        if (active) {
          setTokenValid(true);
          setValidationError('');
        }
      } catch (err: any) {
        if (active) {
          setTokenValid(false);
          setValidationError(err?.message || 'Este link de redefinição expirou ou já foi utilizado.');
        }
      } finally {
        if (active) {
          setIsValidating(false);
        }
      }
    }

    validate();
    return () => {
      active = false;
    };
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas informadas não conferem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.resetPassword(email, token, password);
      setIsCompleted(true);
      toast.success(response.message || 'Senha redefinida com sucesso!');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao redefinir a senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-600 to-amber-500" />

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-slate-900">IMPERIAL</span>
              <span className="text-[11px] block text-red-600 font-bold tracking-widest uppercase">
                Pizza OS • Segurança
              </span>
            </div>
          </div>

          {isValidating ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Validando link de redefinição...</p>
            </div>
          ) : !tokenValid ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-900">Link inválido ou expirado</p>
                  <p className="text-xs text-red-700 leading-relaxed">{validationError}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full cursor-pointer py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para o Login</span>
              </button>
            </div>
          ) : isCompleted ? (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-900">Senha alterada com sucesso!</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Sua nova senha já está ativa para a conta <strong>{email}</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full cursor-pointer py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Acessar minha conta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Definir nova senha</h1>
                <p className="text-xs text-slate-500">
                  Conta: <strong className="text-slate-700">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nova Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirmar Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Salvar nova senha</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

