import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuthStore } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AuthDialogProps {
  showLanding?: boolean;
  onShowLanding?: () => void;
}

export function AuthDialog({ showLanding = false, onShowLanding }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error) {
      // Error is handled by store
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    clearError();
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Maplify Tech
                </span>
              </div>
              <CardTitle className="text-center">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {mode === 'login'
                  ? 'Sign in to access your whiteboards'
                  : 'Create an account to start drawing'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  {mode === 'register' && (
                    <p className="text-sm text-muted-foreground">
                      At least 8 characters
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                <div className="text-center text-sm">
                  <Button
                    type="button"
                    variant="link"
                    onClick={switchMode}
                    className="text-sm"
                  >
                    {mode === 'login'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </Button>
                </div>

                {showLanding && onShowLanding && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onShowLanding}
                      className="text-sm"
                    >
                      ← Back to Home
                    </Button>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Your boards are securely stored and synced across devices.
                </p>
              </div>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
