import { useAdminAuth } from './useAuth';

export const useUserPermissions = () => {
  const { isAdmin, loading, user } = useAdminAuth();

  return { isAdmin, loading, user };
};