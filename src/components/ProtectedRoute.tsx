import { ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAuth';
import { AdminLogin } from '@/components/AdminLogin';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  fallback,
  requireAdmin = true 
}: ProtectedRouteProps) => {
  const { isAdmin, isAuthenticated, loading } = useAdminAuth();

  // Show loading spinner while checking authentication
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

  // If admin access is required and user is not admin, show login
  if (requireAdmin && !isAdmin) {
    return fallback || <AdminLogin />;
  }

  // If authentication is required and user is not authenticated, show login
  if (!isAuthenticated) {
    return fallback || <AdminLogin />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Specific component for admin-only routes
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

// Component for any authenticated user
export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute requireAdmin={false}>
      {children}
    </ProtectedRoute>
  );
};
