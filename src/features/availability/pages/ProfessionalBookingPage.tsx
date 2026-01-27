import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProfessionalAvailability } from '../hooks';
import { BookingCalendar } from '../components/BookingCalendar';
import { TimeSlotsList } from '../components/TimeSlotsList';
import { ProfessionalBookingSkeleton } from '../components/ProfessionalBookingSkeleton';
import type { TimeSlotDTO, DayAvailabilityDTO } from '@/shared/dtos/availability.dto';
import { DayOfWeek } from '@/shared/dtos/availability.dto';

export default function ProfessionalBookingPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDTO | null>(null);

  const {
    data: availability,
    isLoading,
    isError,
    error,
  } = useProfessionalAvailability(userId || '');

  // Calculate available dates from the weekly schedule
  const availableDates = useMemo(() => {
    if (!availability?.schedule) return new Set<string>();

    const dates = new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look ahead 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay() as DayOfWeek;

      // Find availability for this day of week
      const dayAvailability = availability.schedule.find(
        (day) => day.dayOfWeek === dayOfWeek && day.enabled
      );

      if (dayAvailability && dayAvailability.timeSlots.length > 0) {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        dates.add(dateStr);
      }
    }

    return dates;
  }, [availability]);

  // Get time slots for selected date
  const timeSlotsForDate = useMemo(() => {
    if (!selectedDate || !availability?.schedule) return [];

    const dayOfWeek = selectedDate.getDay() as DayOfWeek;
    const dayAvailability = availability.schedule.find(
      (day) => day.dayOfWeek === dayOfWeek && day.enabled
    );

    return dayAvailability?.timeSlots || [];
  }, [selectedDate, availability]);

  // Error handling
  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error al cargar la disponibilidad';

    // Check if it's a 404 or user not found
    const isNotFound =
      errorMessage.includes('404') ||
      errorMessage.includes('not found') ||
      errorMessage.includes('No encontrado');

    return (
      <div className="min-h-svh flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {isNotFound
                    ? 'Profesional no encontrado'
                    : 'Error al cargar disponibilidad'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isNotFound
                    ? 'El profesional que buscas no existe o no tiene disponibilidad configurada.'
                    : 'No se pudo cargar la disponibilidad. Por favor, intenta de nuevo más tarde.'}
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <ProfessionalBookingSkeleton />;
  }

  // No availability configured
  if (!availability || !availability.schedule || availability.schedule.length === 0) {
    return (
      <div className="min-h-svh flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Sin disponibilidad configurada
                </h2>
                <p className="text-sm text-muted-foreground">
                  Este profesional aún no ha configurado sus horarios de disponibilidad.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if there are any enabled days with time slots
  const hasAnyAvailability = availability.schedule.some(
    (day) => day.enabled && day.timeSlots.length > 0
  );

  if (!hasAnyAvailability) {
    return (
      <div className="min-h-svh flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                  Sin horarios disponibles
                </h2>
                <p className="text-sm text-muted-foreground">
                  Este profesional no tiene horarios disponibles configurados.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6 md:py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="size-9 shrink-0"
          >
            <ArrowLeft className="size-5" />
            <span className="sr-only">Volver</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-semibold tracking-tight md:text-lg">
              Selecciona una fecha y hora
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {/* Left column - Calendar */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="mb-4 text-base font-semibold md:text-lg">
                  Selecciona una fecha
                </h2>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  availableDates={availableDates}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Time slots */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4 md:p-6">
                {selectedDate ? (
                  <TimeSlotsList
                    slots={timeSlotsForDate}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    date={selectedDate}
                  />
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Selecciona una fecha en el calendario para ver los horarios disponibles
                    </p>
                  </div>
                )}

                {/* Confirm button */}
                {selectedDate && selectedSlot && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      className="w-full"
                      onClick={() => {
                        // TODO: Navigate to booking confirmation page
                        console.log('Booking:', {
                          date: selectedDate,
                          slot: selectedSlot,
                          professionalId: userId,
                        });
                      }}
                    >
                      Confirmar cita
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
