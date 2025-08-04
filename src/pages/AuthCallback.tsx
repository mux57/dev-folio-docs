import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Wait longer for auth state to settle properly
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (loading) {
        return;
      }

      if (user && isAdmin) {
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.email}`,
        });
        // Navigate directly without showing intermediate pages
        window.location.href = '/blog/write';
      } else if (user && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions for this portfolio.",
          variant: "destructive"
        });
        // Navigate directly to avoid flash
        window.location.href = '/blog';
      } else {
        toast({
          title: "Login Failed",
          description: "Authentication was not completed. Please try again.",
          variant: "destructive"
        });
        // Navigate directly to avoid flash
        window.location.href = '/admin/login';
      }
    };

    // Longer delay to ensure auth state is fully processed
    const timer = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timer);
  }, [user, isAdmin, loading, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Completing Login...</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your Google authentication and check your permissions.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          This may take a few seconds...
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
