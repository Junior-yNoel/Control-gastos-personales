import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface LoginRegisterProps {
  onLogin: (username: string) => void;
}

export function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername && loginPassword) {
      // En una app real, aquí verificarías las credenciales
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === loginUsername && u.password === loginPassword);
      
      if (user) {
        onLogin(loginUsername);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerUsername && registerPassword && registerPassword === registerConfirmPassword) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el usuario ya existe
      if (users.find((u: any) => u.username === registerUsername)) {
        alert('El usuario ya existe');
        return;
      }

      users.push({ username: registerUsername, password: registerPassword });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Usuario registrado exitosamente');
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setShowRegister(false);
    } else if (registerPassword !== registerConfirmPassword) {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className={`flex gap-8 items-start ${showRegister ? 'flex-col md:flex-row' : ''}`}>
        {/* Login Card */}
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-indigo-500 shadow-xl">
              <img 
                src="https://avatars.githubusercontent.com/u/191634123?v=4"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl mb-2">Bienvenido</h1>
            <p className="text-gray-600 text-center dark:text-slate-400">Inicia sesión para controlar tus gastos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="username" className="text-base">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                className="mt-2 h-11"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-base">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="mt-2 h-11"
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base">
              Iniciar Sesión
            </Button>

            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-gray-600 mb-2 dark:text-slate-400">¿No tienes cuenta?</p>
              <button
                type="button"
                onClick={() => setShowRegister(!showRegister)}
                className="text-indigo-600 hover:text-indigo-800 underline text-base"
              >
                {showRegister ? 'Ocultar registro' : 'Registrarte'}
              </button>
            </div>
          </form>
        </Card>

        {/* Register Card */}
        {showRegister && (
          <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
            <div className="mb-6 text-center">
              <h2 className="text-3xl mb-2">Registro Nuevo</h2>
              <p className="text-gray-600 dark:text-slate-400">Crea tu cuenta para empezar</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <Label htmlFor="reg-username" className="text-base">Usuario</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Elige un nombre de usuario"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="reg-password" className="text-base">Contraseña</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Crea una contraseña"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="reg-confirm-password" className="text-base">Confirmar Contraseña</Label>
                <Input
                  id="reg-confirm-password"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                  className="mt-2 h-11"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-11 text-base">
                Registrarse
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}