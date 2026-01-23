/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '@/app/guards/auth.guard';

// Auth pages (public)
import LoginPage from '@/features/auth/pages/login/page';
import SignupPage from '@/features/auth/pages/signup/page';

// Placeholder for authenticated home/dashboard
function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. You are authenticated!
        </p>
      </div>
    </div>
  );
}

// 404 Not Found page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="text-xl">Page not found</p>
      </div>
    </div>
  );
}

/**
 * Application router configuration.
 *
 * Route structure:
 * - Public routes (GuestGuard): Accessible only when NOT authenticated
 *   - /login
 *   - /signup
 *
 * - Protected routes (AuthGuard): Require authentication
 *   - / (dashboard)
 *   - /professionals (coming soon)
 *   - /appointments (coming soon)
 */
const router = createBrowserRouter([
  // Public routes - Only accessible when NOT authenticated
  {
    element: <GuestGuard redirectTo="/" />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },

  // Protected routes - Require authentication
  {
    element: <AuthGuard redirectTo="/login" />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      // Add more protected routes here:
      // {
      //   path: '/professionals',
      //   element: <ProfessionalsPage />,
      // },
      // {
      //   path: '/appointments',
      //   element: <AppointmentsPage />,
      // },
    ],
  },

  // Catch-all 404 route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * Router Provider component.
 * Wrap your app with this to enable routing.
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router };
