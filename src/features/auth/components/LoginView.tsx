'use client';

import { LoginForm } from './Forms/LoginForm';
import { LoginHero } from './AuthRight/LoginHero';
import { authApi } from '../apis/authApi';
import toast, { Toaster } from 'react-hot-toast';
import { Preloader } from '@/components/ui/Preloader';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorTempToken, setTwoFactorTempToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const [shineIndex, setShineIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const saveSessionAndRedirect = (token?: string, successMsg = 'Login realizado com sucesso! 🎉') => {
    if (token) {
      if (rememberMe) {
        localStorage.setItem('imperial_token', token);
      } else {
        sessionStorage.setItem('imperial_token', token);
      }
    }
    toast.success(successMsg);
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password, rememberMe);

      if (response.requires_2fa && response.temp_token) {
        setTwoFactorTempToken(response.temp_token);
        setTwoFactorCode('');
        toast.success('Informe o código do seu aplicativo autenticador.');
        return;
      }

      saveSessionAndRedirect(response.token);
    } catch (error: any) {
      toast.error(error.message || 'Falha na autenticação. Verifique os dados!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorTempToken) return;
    setIsLoading(true);

    try {
      const response = await authApi.verifyTwoFactor(twoFactorTempToken, twoFactorCode.trim());
      saveSessionAndRedirect(response.token);
    } catch (error: any) {
      toast.error(error.message || 'Código inválido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel2fa = () => {
    setTwoFactorTempToken(null);
    setTwoFactorCode('');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await authApi.loginWithGoogle(tokenResponse.access_token);
        
        if (response.requires_2fa && response.temp_token) {
          setTwoFactorTempToken(response.temp_token);
          setTwoFactorCode('');
          toast.success('Informe o código do seu aplicativo autenticador.');
          return;
        }

        saveSessionAndRedirect(response.token, 'Login com Google realizado com sucesso! 🎉');
      } catch (error: any) {
        toast.error(error.message || 'Falha no login com Google.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('O login com Google foi cancelado ou falhou.');
    }
  });

  return (
    <main className="min-h-screen flex bg-white relative">
      {isLoading && <Preloader fullScreen={true} message="ASSANDO SUAS INFORMAÇÕES..." />}
      <Toaster position="top-right" />
      <LoginForm
        email={email}
        password={password}
        showPassword={showPassword}
        rememberMe={rememberMe}
        isLoading={isLoading}
        isTwoFactorStep={Boolean(twoFactorTempToken)}
        twoFactorCode={twoFactorCode}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onRememberMeChange={() => setRememberMe(!rememberMe)}
        onSubmit={handleLogin}
        onGoogleLogin={() => googleLogin()}
        onTwoFactorCodeChange={setTwoFactorCode}
        onVerifyTwoFactor={handleVerify2fa}
        onCancelTwoFactor={handleCancel2fa}
      />

      <LoginHero shineIndex={shineIndex} />
    </main>
  );
}

export default function LoginView() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
