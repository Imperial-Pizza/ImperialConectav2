export async function getMe() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';
  
  // Lê o token do localStorage
  const token = localStorage.getItem('imperial_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}/auth/me`, {
    method: 'GET',
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro na API auth/me:', response.status, errorText);
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  
  // A API real retorna os dados dentro de um objeto { user: { ... } }
  const userData = data.user || data;
  
  return {
    ...userData,
    // Adiciona propriedades default que o frontend espera mas que a API não retorna
    avatar: userData.name ? userData.name.charAt(0).toUpperCase() : 'U',
    lastAccess: 'Agora'
  };
}

export async function logout() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api';
  
  const token = localStorage.getItem('imperial_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro na API auth/logout:', response.status, errorText);
    throw new Error('Failed to logout');
  }

  return response.json();
}
