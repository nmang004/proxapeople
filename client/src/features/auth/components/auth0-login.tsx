import React from 'react';
import { useAuth } from '@/app/store/auth0-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Users } from 'lucide-react';

export function Auth0LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = () => {
    clearError();
    login();
  };

  const handleDemoLogin = () => {
    // For demo, we'll redirect to Auth0 with a demo user hint
    // In production, you might want to handle this differently
    clearError();
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome to ProxaPeople</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your HR dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In with Auth0
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or try demo
              </span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Users className="mr-2 h-4 w-4" />
            Demo Access
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              New to ProxaPeople? Your account will be created automatically
              when you sign in for the first time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}