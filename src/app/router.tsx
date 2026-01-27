/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '@/app/guards/auth.guard';

// Auth pages (public)
import LoginPage from '@/features/auth/pages/login/page';
import SignupPage from '@/features/auth/pages/signup/page';

// Authenticated pages
import HomePage from '@/features/home/pages/HomePage';
import AvailabilityPage from '@/features/availability/pages/AvailabilityPage';

// Public pages
import ProfessionalBookingPage from '@/features/availability/pages/ProfessionalBookingPage';

// Error pages
import NotFoundPage from '@/app/pages/NotFoundPage';

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

  // Public booking page - Accessible without authentication
  {
    path: '/professional/:userId',
    element: <ProfessionalBookingPage />,
  },

  // Protected routes - Require authentication
  {
    element: <AuthGuard redirectTo="/login" />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/availability',
        element: <AvailabilityPage />,
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
