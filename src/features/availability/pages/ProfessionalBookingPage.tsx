import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfessionalAvailability } from '../hooks';
import { useAppointmentsByDate, useCreateAppointment } from '@/features/appointments';
import {
  BookingCalendar,
  TimeSlotsList,
  ProfessionalBookingSkeleton,
  BookingErrorState,
  ProfessionalInfoCard,
  BookingEmptyState,
  BookingPageHeader,
} from '../components';
import { Card, CardContent } from '@/components/ui/card';
import type { TimeSlotDTO } from '@/shared/dtos/availability.dto';
import { formatProfessionalName } from '@/shared/dtos/availability.dto';
import {
  calculateAvailableDates,
  getTimeSlotsForDate,
  formatDateString,
  parseDateString,
} from '@/lib/availability-utils';

/**
 * Professional Booking Page
 * 
 * Displays a booking interface for clients to select dates and time slots
 * for a specific professional. Handles availability display, appointment
 * filtering, and booking selection.
 */
export default function ProfessionalBookingPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDTO | null>(null);

  // Fetch professional availability
  const {
    data: availability,
    isLoading,
    error,
  } = useProfessionalAvailability(userId || '');

  // Fetch appointments for selected date
  const selectedDateStr = selectedDate ? formatDateString(selectedDate) : '';
  const { data: appointments = [], isLoading: isAppointmentsLoading } =
    useAppointmentsByDate(userId || '', selectedDateStr);

  // Create appointment mutation
  const createAppointment = useCreateAppointment();

  // Calculate available dates from weekly schedule
  const availableDates = useMemo(() => {
    if (!availability?.schedule) return new Set<string>();
    return calculateAvailableDates(availability.schedule);
  }, [availability]);

  // Get time slots for selected date
  const timeSlotsForDate = useMemo(() => {
    if (!selectedDate || !availability?.schedule) return [];
    return getTimeSlotsForDate(selectedDate, availability.schedule);
  }, [selectedDate, availability]);

  // Handle booking confirmation
  const handleConfirmBooking = async (slot: TimeSlotDTO) => {
    if (!selectedDate || !userId) return;

    try {
      await createAppointment.mutateAsync({
        professionalId: userId,
        date: formatDateString(selectedDate),
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      toast.success('Cita reservada exitosamente');
      setSelectedSlot(null); // Reset selected slot after successful booking
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al reservar la cita. Por favor, intenta de nuevo.';
      toast.error(errorMessage);
    }
  };

  // Auto-select first available date if none selected
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedDate && availableDates.size > 0 && !isLoading) {
      const today = new Date();
      const sortedDates = Array.from(availableDates)
        .map(parseDateString)
        .sort((a, b) => a.getTime() - b.getTime())
        .filter((d) => d >= today);

      if (sortedDates.length > 0) {
        setSelectedDate(sortedDates[0]);
      }
    }
    // Note: We intentionally exclude selectedDate from deps to avoid infinite loop
    // This effect only runs when availability data loads or changes
  }, [availableDates, isLoading]);

  // Handle missing userId
  if (!userId) {
    return (
      <div className="min-h-svh">
        <BookingPageHeader title="ID de usuario requerido" onBack={() => navigate('/')} />
        <main className="mx-auto max-w-2xl px-3 py-8 md:px-6">
          <BookingErrorState
            title="ID de usuario no válido"
            message="Por favor, proporciona un ID de usuario válido en la URL."
            onBack={() => navigate('/')}
          />
        </main>
      </div>
    );
  }

  // Handle errors
  if (error) {
    const axiosError = error as { response?: { status?: number }; message?: string };
    const status = axiosError.response?.status;
    
    let title = 'Error al cargar disponibilidad';
    let message = 'Ocurrió un error al cargar la disponibilidad. Por favor, intenta de nuevo más tarde.';
    let variant: 'error' | 'warning' = 'error';

    if (status === 404) {
      title = 'Usuario no encontrado';
      message = 'El profesional que buscas no existe o no está disponible.';
    } else if (status === 401) {
      title = 'Acceso no autorizado';
      message = 'No tienes permisos para ver esta disponibilidad.';
    } else if (status === 400) {
      title = 'Sin disponibilidad';
      message = 'Este profesional aún no ha configurado sus horarios de disponibilidad.';
      variant = 'warning';
    }

    return (
      <div className="min-h-svh">
        <BookingPageHeader title="Disponibilidad no encontrada" onBack={() => navigate('/')} />
        <main className="mx-auto max-w-2xl px-3 py-8 md:px-6">
          <BookingErrorState title={title} message={message} onBack={() => navigate('/')} variant={variant} />
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <ProfessionalBookingSkeleton />;
  }

  // No availability configured
  if (!availability || availableDates.size === 0) {
    return (
      <div className="min-h-svh">
        <BookingPageHeader title="Sin disponibilidad" onBack={() => navigate('/')} />
        <main className="mx-auto max-w-2xl px-3 py-8 md:px-6">
          <BookingErrorState
            title="No hay disponibilidad configurada"
            message="Este profesional aún no ha configurado sus horarios de disponibilidad."
            onBack={() => navigate('/')}
            variant="warning"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-svh">
      <BookingPageHeader
        title="Selecciona una fecha y hora"
        onBack={() => navigate('/')}
      />

      <main className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left section - Professional info */}
          <div className="lg:col-span-1">
            <ProfessionalInfoCard
              professionalId={availability.professionalId}
              professionalName={formatProfessionalName(
                availability.professionalFirstName,
                availability.professionalLastName
              )}
            />
          </div>

          {/* Middle section - Calendar */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/30">
              <CardContent className="p-4 md:p-6">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  availableDates={availableDates}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right section - Time slots */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/30">
              <CardContent className="p-4 md:p-6">
                {selectedDate && timeSlotsForDate.length > 0 ? (
                  <TimeSlotsList
                    selectedDate={selectedDate}
                    timeSlots={timeSlotsForDate}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    appointments={appointments}
                    onConfirmBooking={handleConfirmBooking}
                    professionalName={formatProfessionalName(
                      availability.professionalFirstName,
                      availability.professionalLastName
                    )}
                    isLoading={createAppointment.isPending}
                    isLoadingAppointments={isAppointmentsLoading}
                  />
                ) : selectedDate ? (
                  <BookingEmptyState
                    title="Sin horarios disponibles"
                    message="No hay horarios disponibles para este día."
                  />
                ) : (
                  <BookingEmptyState
                    title="Selecciona una fecha"
                    message="Elige una fecha en el calendario para ver los horarios disponibles."
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
