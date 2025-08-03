import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Shield } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const AdminHeader = () => {
  const { isAdmin, isAuthenticated, user, signOut } = useAdminAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Badge variant="default" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      )}
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{user?.email}</span>
      </div>
      
      <Button
        onClick={handleSignOut}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
