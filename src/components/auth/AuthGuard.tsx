import React, { useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import Login from './Login';
import Register from './Register';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl text-white font-bold">A</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">AssPharma</h2>
            <p className="text-muted-foreground italic">l'As dans la gestion de la pharmacie</p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <>{children}</>;
}
