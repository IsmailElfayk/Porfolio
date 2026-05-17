import { useState } from 'react';
import Studio from './pages/Studio';
import Login  from './pages/Login';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');

  const handleLogin = (tok) => setToken(tok);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) return <Login onLogin={handleLogin} />;
  return <Studio token={token} onLogout={handleLogout} />;
}
