import React, { useState } from 'react';
import { Redirect } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate password in real-time
    if (name === 'newPassword') {
      setPasswordValidation(validatePassword(value));
    }

    // Clear errors when user starts typing
    if (errors) setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      // Validation
      if (!formData.newPassword || !formData.confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const validation = validatePassword(formData.newPassword);
      const isPasswordValid = Object.values(validation).every(Boolean);
      if (!isPasswordValid) {
        throw new Error('Password does not meet security requirements');
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      setErrors(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ValidationIndicator = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center text-xs ${isValid ? 'text-green-600' : 'text-red-500'}`}>
      {isValid ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
      {text}
    </div>
  );

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully updated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                You can now login to your account using your new password.
              </AlertDescription>
            </Alert>

            <Button
              className="w-full"
              onClick={() => window.location.href = '/auth'}
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
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
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                autoComplete="new-password"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.newPassword && (
              <div className="space-y-1 mt-2">
                <ValidationIndicator isValid={passwordValidation.length} text="At least 8 characters" />
                <ValidationIndicator isValid={passwordValidation.uppercase} text="One uppercase letter" />
                <ValidationIndicator isValid={passwordValidation.lowercase} text="One lowercase letter" />
                <ValidationIndicator isValid={passwordValidation.number} text="One number" />
                <ValidationIndicator isValid={passwordValidation.special} text="One special character" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.confirmPassword && (
              <ValidationIndicator 
                isValid={formData.newPassword === formData.confirmPassword} 
                text="Passwords match" 
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Contact support for assistance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}