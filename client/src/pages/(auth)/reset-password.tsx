import React from 'react';
import { useLocation } from 'wouter';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  const [location] = useLocation();
  
  // Extract token from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <a 
              href="/auth" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm 
          token={token}
          onSuccess={() => {
            // Redirect to login after successful reset
            setTimeout(() => {
              window.location.href = '/auth';
            }, 2000);
          }}
        />
      </div>
    </div>
  );
}