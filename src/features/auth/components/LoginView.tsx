'use client';

import { LoginForm } from './Forms/LoginForm';
import { LoginHero } from './AuthRight/LoginHero';
import { authApi } from '../apis/authApi';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // React Bits style animation state hook for shiny text effect
  const [shineIndex, setShineIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setShineIndex(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      // Aqui você pode salvar o token via cookies, localStorage, Zustand, etc.
      if (rememberMe) {
        localStorage.setItem('imperial_token', response.token);
      } else {
        sessionStorage.setItem('imperial_token', response.token);
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Falha na autenticação. Verifique os dados!');
    } finally {
      setIsLoading(false);
    }
  };

return (
  <main className="min-h-screen flex bg-white">
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
      onGoogleLogin={() => {
        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);
          router.push('/dashboard');
        }, 1000);
      }}
    />

    <LoginHero shineIndex={shineIndex} />
  </main>
);
}
