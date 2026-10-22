export async function getMe() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';
  
  if (typeof window === 'undefined') {
    return null;
  }

  // Lê o token do localStorage ou sessionStorage
  const token =
    localStorage.getItem('imperial_token') ||
    sessionStorage.getItem('imperial_token');
  
  if (!token) {
    return null;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.warn('Aviso na API auth/me:', response.status, errorText);
      
      // Se o token for inválido (400) ou não autorizado (401), limpa credenciais inválidas
      if (response.status === 400 || response.status === 401) {
        localStorage.removeItem('imperial_token');
        sessionStorage.removeItem('imperial_token');
      }
      
      return null;
    }

    const data = await response.json();
    const userData = data.user || data;
    
    return {
      ...userData,
      avatar: userData.name ? userData.name.charAt(0).toUpperCase() : 'A',
      lastAccess: 'Agora'
    };
  } catch (error) {
    console.warn('Aviso: Falha de conexão com a API de auth/me (servidor offline ou Vercel):', error);
    return null;
  }
}

export async function logout() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';
  
  const token = localStorage.getItem('imperial_token') || sessionStorage.getItem('imperial_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Limpa o token do storage do navegador para deslogar imediatamente
  localStorage.removeItem('imperial_token');
  sessionStorage.removeItem('imperial_token');

  try {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API auth/logout:', response.status, errorText);
    }
  } catch (error) {
    console.error('Erro de rede ao deslogar:', error);
  }
}
