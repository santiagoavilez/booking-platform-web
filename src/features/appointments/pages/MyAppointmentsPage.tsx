import { useNavigate } from 'react-router-dom';
import { useMyAppointments } from '../hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentStatus } from '@/shared/dtos/appointment.dto';

/**
 * My Appointments Page
 * Displays all appointments for the authenticated user (as client)
 * Follows Clean Architecture: UI layer for rendering and user interaction
 */
export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { data: appointments, isLoading, error } = useMyAppointments();

  // Format date for display (Spanish format)
  const formatDate = (dateString: string) => {
    try {
      // Parse YYYY-MM-DD format directly to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      
      return `${dayName}, ${day} de ${monthName} de ${year}`;
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Get status label in Spanish
  const getStatusLabel = (status?: AppointmentStatus) => {
    if (!status) return 'Pendiente';
    
    const statusMap: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Pendiente',
      [AppointmentStatus.CONFIRMED]: 'Confirmada',
      [AppointmentStatus.CANCELLED]: 'Cancelada',
      [AppointmentStatus.COMPLETED]: 'Completada',
    };
    
    return statusMap[status] || 'Pendiente';
  };

  // Get status color
  const getStatusColor = (status?: AppointmentStatus) => {
    if (!status) return 'bg-yellow-500/20 text-yellow-500';
    
    const colorMap: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'bg-yellow-500/20 text-yellow-500',
      [AppointmentStatus.CONFIRMED]: 'bg-green-500/20 text-green-500',
      [AppointmentStatus.CANCELLED]: 'bg-red-500/20 text-red-500',
      [AppointmentStatus.COMPLETED]: 'bg-blue-500/20 text-blue-500',
    };
    
    return colorMap[status] || 'bg-yellow-500/20 text-yellow-500';
  };

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
              className="h-8 w-8 p-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
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
                <p className="text-sm text-muted-foreground mt-2">
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
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="mb-4 flex justify-center">
                      <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-lg mb-2">
                      No tienes citas programadas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tus citas aparecerán aquí cuando reserves una cita con un profesional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg">
                          {formatDate(appointment.date)}
                        </CardTitle>
                        {appointment.status && (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                          >
                            {getStatusLabel(appointment.status)}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Horario</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Profesional</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {appointment.professionalId}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
