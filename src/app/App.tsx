import { useState, useEffect } from 'react';
import { LoginRegister } from './components/LoginRegister';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
      setCurrentUser(loggedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="size-full">
      {currentUser ? (
        <Dashboard username={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginRegister onLogin={handleLogin} />
      )}
    </div>
  );
}
