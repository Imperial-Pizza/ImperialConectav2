const fs = require('fs');
const path = require('path');
const root = 'c:/git/ImperialConectav2';

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

// src/app/page.tsx  (root redirect to /login)
write(path.join(root, 'src/app/page.tsx'), [
  "import { redirect } from 'next/navigation';",
  "",
  "export default function RootPage() {",
  "  redirect('/login');",
  "}",
  "",
].join('\n'));

// src/app/denuncia/page.tsx
write(path.join(root, 'src/app/denuncia/page.tsx'), [
  "import DenunciaPage from '@/features/denuncia/components/DenunciaPage';",
  "",
  "export default function Page() {",
  "  return <DenunciaPage />;",
  "}",
  "",
].join('\n'));

// src/app/dashboard/page.tsx
write(path.join(root, 'src/app/dashboard/page.tsx'), [
  "import ImperialDashboard from '@/features/dashboard/components/ImperialDashboard';",
  "",
  "export default function DashboardPage() {",
  "  return <ImperialDashboard />;",
  "}",
  "",
].join('\n'));

// src/layouts/AuthLayout.tsx
write(path.join(root, 'src/layouts/AuthLayout.tsx'), [
  "import React from 'react';",
  "",
  "interface AuthLayoutProps {",
  "  children: React.ReactNode;",
  "}",
  "",
  "export default function AuthLayout({ children }: AuthLayoutProps) {",
  "  return (",
  "    <div className='min-h-screen w-full bg-white'>",
  "      {children}",
  "    </div>",
  "  );",
  "}",
  "",
].join('\n'));

// src/layouts/MainLayout.tsx
write(path.join(root, 'src/layouts/MainLayout.tsx'), [
  "import React from 'react';",
  "",
  "interface MainLayoutProps {",
  "  children: React.ReactNode;",
  "}",
  "",
  "export default function MainLayout({ children }: MainLayoutProps) {",
  "  return (",
  "    <div className='min-h-screen w-full bg-slate-900'>",
  "      {children}",
  "    </div>",
  "  );",
  "}",
  "",
].join('\n'));

// src/types/index.ts
write(path.join(root, 'src/types/index.ts'), [
  "export type UserRole = 'admin' | 'gerente' | 'atendente' | 'cozinheiro';",
  "",
  "export interface User {",
  "  id: string;",
  "  name: string;",
  "  email: string;",
  "  role: UserRole;",
  "  avatar?: string;",
  "}",
  "",
].join('\n'));

// src/lib/utils/index.ts
write(path.join(root, 'src/lib/utils/index.ts'), [
  "export { cn } from './cn';",
  "",
].join('\n'));

// src/lib/api/index.ts
write(path.join(root, 'src/lib/api/index.ts'), [
  "const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';",
  "",
  "export async function apiGet<T>(endpoint: string): Promise<T> {",
  "  const res = await fetch(`${BASE_URL}${endpoint}`);",
  "  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);",
  "  return res.json();",
  "}",
  "",
  "export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {",
  "  const res = await fetch(`${BASE_URL}${endpoint}`, {",
  "    method: 'POST',",
  "    headers: { 'Content-Type': 'application/json' },",
  "    body: JSON.stringify(body),",
  "  });",
  "  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);",
  "  return res.json();",
  "}",
  "",
].join('\n'));

// src/lib/auth/index.ts
write(path.join(root, 'src/lib/auth/index.ts'), [
  "export function getToken(): string | null {",
  "  if (typeof window === 'undefined') return null;",
  "  return localStorage.getItem('imperial_token');",
  "}",
  "",
  "export function setToken(token: string): void {",
  "  localStorage.setItem('imperial_token', token);",
  "}",
  "",
  "export function clearToken(): void {",
  "  localStorage.removeItem('imperial_token');",
  "}",
  "",
  "export function isAuthenticated(): boolean {",
  "  return !!getToken();",
  "}",
  "",
].join('\n'));

// src/features/auth/types/index.ts
write(path.join(root, 'src/features/auth/types/index.ts'), [
  "export interface LoginCredentials {",
  "  email: string;",
  "  password: string;",
  "  rememberMe?: boolean;",
  "}",
  "",
  "export interface AuthResponse {",
  "  token: string;",
  "  user: {",
  "    id: string;",
  "    name: string;",
  "    email: string;",
  "    role: string;",
  "  };",
  "}",
  "",
].join('\n'));

// src/features/auth/services/authService.ts
write(path.join(root, 'src/features/auth/services/authService.ts'), [
  "import type { LoginCredentials, AuthResponse } from '../types';",
  "",
  "export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {",
  "  await new Promise((resolve) => setTimeout(resolve, 1000));",
  "  return {",
  "    token: 'mock-jwt-token',",
  "    user: {",
  "      id: '1',",
  "      name: 'Usuário Imperial',",
  "      email: credentials.email,",
  "      role: 'admin',",
  "    },",
  "  };",
  "}",
  "",
].join('\n'));

// src/features/auth/hooks/useAuth.ts
write(path.join(root, 'src/features/auth/hooks/useAuth.ts'), [
  "'use client';",
  "import { useState } from 'react';",
  "import { useRouter } from 'next/navigation';",
  "import { loginUser } from '../services/authService';",
  "import type { LoginCredentials } from '../types';",
  "",
  "export function useAuth() {",
  "  const router = useRouter();",
  "  const [isLoading, setIsLoading] = useState(false);",
  "  const [error, setError] = useState<string | null>(null);",
  "",
  "  const login = async (credentials: LoginCredentials) => {",
  "    setIsLoading(true);",
  "    setError(null);",
  "    try {",
  "      await loginUser(credentials);",
  "      router.push('/dashboard');",
  "    } catch {",
  "      setError('Falha ao autenticar. Verifique suas credenciais.');",
  "    } finally {",
  "      setIsLoading(false);",
  "    }",
  "  };",
  "",
  "  return { login, isLoading, error };",
  "}",
  "",
].join('\n'));

// src/features/dashboard/types/index.ts
write(path.join(root, 'src/features/dashboard/types/index.ts'), [
  "export interface DashboardStats {",
  "  totalOrders: number;",
  "  totalRevenue: number;",
  "  activeEmployees: number;",
  "  pendingOrders: number;",
  "}",
  "",
].join('\n'));

// src/features/equipe/types/index.ts
write(path.join(root, 'src/features/equipe/types/index.ts'), [
  "export interface Employee {",
  "  id: string;",
  "  name: string;",
  "  role: string;",
  "  department: string;",
  "  status: 'ativo' | 'inativo' | 'ferias';",
  "  hireDate: string;",
  "  avatar?: string;",
  "}",
  "",
].join('\n'));

// src/features/producao/types/index.ts
write(path.join(root, 'src/features/producao/types/index.ts'), [
  "export interface OrderItem {",
  "  id: string;",
  "  name: string;",
  "  quantity: number;",
  "  unitPrice: number;",
  "  notes?: string;",
  "}",
  "",
  "export interface Order {",
  "  id: string;",
  "  table: number;",
  "  items: OrderItem[];",
  "  status: 'pendente' | 'em_producao' | 'pronto' | 'entregue';",
  "  createdAt: string;",
  "  totalPrice: number;",
  "}",
  "",
].join('\n'));

console.log('All FDD boilerplate files created!');
