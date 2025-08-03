import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin as AdminLoginComponent } from '@/components/AdminLogin';
import { useAdminAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    // If already authenticated as admin, redirect to blog write
    if (!loading && isAdmin) {
      navigate('/blog/write');
    }
  }, [isAdmin, loading, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already admin, don't show login (will redirect)
  if (isAdmin) {
    return null;
  }

  return (
    <AdminLoginComponent 
      onSuccess={() => navigate('/blog/write')}
      redirectTo="/blog/write"
    />
  );
};

export default AdminLoginPage;
