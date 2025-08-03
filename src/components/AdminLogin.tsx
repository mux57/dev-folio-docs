import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const AdminLogin = ({ onSuccess, redirectTo }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  
  const { signInWithGoogle, signInWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message || 'Failed to sign in with Google');
      } else {
        toast({
          title: "Signing in...",
          description: "Redirecting to Google for authentication.",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error.message || 'Failed to sign in');
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message || 'Failed to send reset email');
      } else {
        toast({
          title: "Reset email sent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to manage your blog posts
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showEmailLogin ? (
            // Google Sign In (Primary)
            <div className="space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setShowEmailLogin(true)}
                variant="outline"
                className="w-full"
              >
                <Lock className="mr-2 h-4 w-4" />
                Sign in with Email
              </Button>
            </div>
          ) : (
            // Email/Password Sign In (Fallback)
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>

              <div className="flex justify-between text-sm">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowEmailLogin(false)}
                  className="p-0 h-auto"
                >
                  ← Back to Google
                </Button>
                
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResetPassword}
                  className="p-0 h-auto"
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Only the portfolio owner can access blog management.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
