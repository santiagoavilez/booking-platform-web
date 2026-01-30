import { useNavigate } from 'react-router-dom';
import { useMyAppointments } from '../hooks';
import { AppointmentCard } from '../components/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * My Appointments Page
 * Displays all appointments for the authenticated user (as client).
 * Follows Clean Architecture: UI layer for rendering and user interaction.
 */
export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { data: appointments, isLoading, error } = useMyAppointments();

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="h-8 w-8 min-h-[44px] min-w-[44px] p-0 md:h-8 md:w-8 md:min-h-0 md:min-w-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Mis citas
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-6 w-48 m-6 mb-2" />
                <CardContent className="space-y-4 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Error al cargar las citas</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No se pudieron cargar tus citas. Por favor, intenta de nuevo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && appointments && (
          <>
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 pt-6">
                  <div className="py-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="mb-2 text-lg font-medium">
                      No tienes citas programadas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tus citas aparecerán aquí cuando reserves una cita con un
                      profesional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
