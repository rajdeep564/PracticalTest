import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  isTokenExpired, 
  getUserFromToken, 
  isAdmin as checkIsAdmin, 
  isUser as checkIsUser,
  getTokenTimeRemaining,
  formatTokenTimeRemaining
} from '../utils/jwt';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  // Check if current user is admin
  const isAdmin = (): boolean => {
    if (!token) return false;
    return checkIsAdmin(token);
  };

  // Check if current user is regular user
  const isUser = (): boolean => {
    if (!token) return false;
    return checkIsUser(token);
  };

  // Check if token is expired
  const isExpired = (): boolean => {
    if (!token) return true;
    return isTokenExpired(token);
  };

  // Get time remaining until token expires
  const getTimeRemaining = (): number => {
    if (!token) return 0;
    return getTokenTimeRemaining(token);
  };

  // Get formatted time remaining
  const getFormattedTimeRemaining = (): string => {
    if (!token) return 'No token';
    return formatTokenTimeRemaining(token);
  };

  // Get user info from token (useful for debugging)
  const getUserInfo = () => {
    if (!token) return null;
    return getUserFromToken(token);
  };

  // Check if user has specific role
  const hasRole = (role: 'admin' | 'user'): boolean => {
    return user?.role === role;
  };

  // Check if user can perform admin actions
  const canPerformAdminActions = (): boolean => {
    return isAuthenticated && isAdmin() && !isExpired();
  };

  // Check if user can perform user actions
  const canPerformUserActions = (): boolean => {
    return isAuthenticated && (isAdmin() || isUser()) && !isExpired();
  };

  return {
    // Basic auth state
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Role checks
    isAdmin: isAdmin(),
    isUser: isUser(),
    hasRole,
    
    // Token utilities
    isExpired: isExpired(),
    timeRemaining: getTimeRemaining(),
    formattedTimeRemaining: getFormattedTimeRemaining(),
    getUserInfo,
    
    // Permission checks
    canPerformAdminActions: canPerformAdminActions(),
    canPerformUserActions: canPerformUserActions()
  };
};
