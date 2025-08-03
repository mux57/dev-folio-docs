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
      console.log('🔄 Processing auth callback...');
      
      // Wait a moment for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (loading) {
        console.log('⏳ Still loading auth state...');
        return;
      }

      if (user && isAdmin) {
        console.log('✅ Admin login successful:', user.email);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.email}`,
        });
        navigate('/blog/write');
      } else if (user && !isAdmin) {
        console.log('❌ User not admin:', user.email);
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions for this portfolio.",
          variant: "destructive"
        });
        navigate('/blog');
      } else {
        console.log('❌ No user found after callback');
        toast({
          title: "Login Failed",
          description: "Authentication was not completed. Please try again.",
          variant: "destructive"
        });
        navigate('/admin/login');
      }
    };

    // Small delay to ensure auth state is processed
    const timer = setTimeout(handleAuthCallback, 500);
    
    return () => clearTimeout(timer);
  }, [user, isAdmin, loading, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h2 className="text-xl font-semibold">Completing Login...</h2>
        <p className="text-muted-foreground">
          Please wait while we verify your authentication.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
