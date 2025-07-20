import React, { useState } from 'react';
import { useAuthStore } from '@/app/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToForgotPassword }: LoginFormProps) {
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors) setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (error) {
      setErrors(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'hr' | 'manager' | 'employee') => {
    const credentials = {
      admin: { email: 'admin@demo.com', password: 'admin' },
      hr: { email: 'hr@demo.com', password: 'hr123' },
      manager: { email: 'manager@demo.com', password: 'manager123' },
      employee: { email: 'employee@demo.com', password: 'employee123' }
    };
    
    const cred = credentials[role];
    setFormData({ email: cred.email, password: cred.password });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your ProxaPeople account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>

          {onSwitchToForgotPassword && (
            <div className="text-right">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onSwitchToForgotPassword}
                disabled={isSubmitting}
              >
                Forgot your password?
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={onSwitchToRegister}
                disabled={isSubmitting}
              >
                Sign up here
              </Button>
            </div>
          )}
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">🚀 Demo Accounts (For Testing)</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => handleDemoLogin('admin')}
              disabled={isSubmitting}
            >
              👑 Admin Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              onClick={() => handleDemoLogin('hr')}
              disabled={isSubmitting}
            >
              👥 HR Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              onClick={() => handleDemoLogin('manager')}
              disabled={isSubmitting}
            >
              📊 Manager Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              onClick={() => handleDemoLogin('employee')}
              disabled={isSubmitting}
            >
              💼 Employee Demo
            </Button>
          </div>
          
          <div className="space-y-2 text-xs text-blue-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">admin@demo.com / admin</p>
                <p className="font-medium">hr@demo.com / hr123</p>
              </div>
              <div>
                <p className="font-medium">manager@demo.com / manager123</p>
                <p className="font-medium">employee@demo.com / employee123</p>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <p className="text-blue-600 text-center text-xs">
                ✨ Click buttons above to auto-fill credentials, then Sign In
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}