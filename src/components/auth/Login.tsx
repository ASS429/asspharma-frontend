import React, { useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AuthPageBranding } from '../PharmacyBranding';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Connexion réussie!', {
          description: 'Bienvenue sur AssPharma'
        });
      }
    } catch (err: any) {
      setError(
        err.message === 'Invalid login credentials' 
          ? 'Email ou mot de passe incorrect'
          : err.message || 'Une erreur est survenue lors de la connexion'
      );
      toast.error('Erreur de connexion', {
        description: 'Vérifiez vos identifiants'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Veuillez saisir votre email d\'abord');
      return;
    }

    try {
      const { error } = await resetPassword(formData.email);
      if (error) throw error;
      
      setResetEmailSent(true);
      toast.success('Email envoyé!', {
        description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe'
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et Branding */}
        <AuthPageBranding />

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace pharmacie
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            {resetEmailSent && (
              <Alert className="mb-4 border-primary/20 bg-primary/5">
                <AlertDescription className="text-primary">
                  Un email de réinitialisation a été envoyé à votre adresse
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Créer un compte
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          © 2024 AssPharma - Gestion professionnelle de pharmacie
        </div>
      </div>
    </div>
  );
}
