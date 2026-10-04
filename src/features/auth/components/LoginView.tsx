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
  
  const [shineIndex, setShineIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('imperial_token', response.token);
      } else {
        sessionStorage.setItem('imperial_token', response.token);
      }
      
      toast.success('Login realizado com sucesso! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Falha na autenticação. Verifique os dados!');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await authApi.loginWithGoogle(tokenResponse.access_token);
        
        if (rememberMe) {
          localStorage.setItem('imperial_token', response.token);
        } else {
          sessionStorage.setItem('imperial_token', response.token);
        }
        
        toast.success('Login com Google realizado com sucesso! 🎉');
        router.push('/dashboard');
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
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onRememberMeChange={() => setRememberMe(!rememberMe)}
        onSubmit={handleLogin}
        onGoogleLogin={() => googleLogin()}
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
