import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';

interface AuthGuardProps {
  /**
   * Redirect path when user is not authenticated
   * @default '/login'
   */
  redirectTo?: string;
}

/**
 * Guard component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
export function AuthGuard({ redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}

interface GuestGuardProps {
  /**
   * Redirect path when user is already authenticated
   * @default '/'
   */
  redirectTo?: string;
}

/**
 * Guard component for public routes (login, signup, etc.).
 * Redirects authenticated users away from auth pages.
 */
export function GuestGuard({ redirectTo = '/' }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Redirect to home/dashboard if already authenticated
  if (isAuthenticated) {
    // Check if there's a saved location to redirect back to
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render child routes if not authenticated
  return <Outlet />;
}
