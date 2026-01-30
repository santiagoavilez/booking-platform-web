import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatTimeDisplay } from '@/shared/dtos/availability.dto';
import type { TimeSlotDTO } from '@/shared/dtos/availability.dto';
import type { AppointmentDTO } from '@/shared/dtos/appointment.dto';
import { cn } from '@/lib/utils';
import {
  generateTimeSlotsFromRanges,
  filterAvailableTimeSlots,
} from '@/lib/availability-utils';
import { AppointmentConfirmationDialog } from './AppointmentConfirmationDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface TimeSlotsListProps {
  selectedDate: Date;
  timeSlots: TimeSlotDTO[];
  selectedSlot: TimeSlotDTO | null;
  onSlotSelect: (slot: TimeSlotDTO) => void;
  appointments?: AppointmentDTO[]; // Optional: appointments to mark slots as occupied
  onConfirmBooking?: (slot: TimeSlotDTO) => void;
  professionalName?: string;
  isLoading?: boolean;
  isLoadingAppointments?: boolean;
}

export function TimeSlotsList({
  selectedDate,
  timeSlots,
  selectedSlot,
  onSlotSelect,
  appointments = [],
  onConfirmBooking,
  professionalName,
  isLoading = false,
  isLoadingAppointments = false,
}: TimeSlotsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dayName = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateStr = selectedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  // Generate all time slots from ranges
  const allSlots = generateTimeSlotsFromRanges(timeSlots);

  // Filter out occupied slots (for per-slot availability check)
  const availableSlots = filterAvailableTimeSlots(allSlots, selectedDate, appointments);

  // Check if selected slot is available (not occupied)
  const isSelectedSlotAvailable = selectedSlot
    ? availableSlots.includes(selectedSlot.startTime)
    : false;

  // Calculate end time for a selected slot (1 hour after start time)
  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + 1;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Find the range that contains a time slot
  const findContainingRange = (time: string): TimeSlotDTO | null => {
    return (
      timeSlots.find((range) => {
        const start = parseInt(range.startTime.replace(':', ''), 10);
        const end = parseInt(range.endTime.replace(':', ''), 10);
        const current = parseInt(time.replace(':', ''), 10);
        return current >= start && current < end;
      }) || null
    );
  };

  const handleConfirmClick = () => {
    if (selectedSlot && isSelectedSlotAvailable) {
      setIsDialogOpen(true);
    }
  };

  const handleDialogConfirm = () => {
    if (selectedSlot && onConfirmBooking) {
      onConfirmBooking(selectedSlot);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold capitalize md:text-lg">
          {dayName}, {dateStr}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
          Selecciona un horario disponible
        </p>
      </div>

      {isLoadingAppointments ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          {/* 5 skeleton loaders */}
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" /> 
            <p className="text-sm text-muted-foreground">Cargando horarios...</p>           
            </div>

        </div>
      ) : allSlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay horarios disponibles para este día.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {/* Slots in chronological order: available (clickable) or occupied (disabled) */}
            {allSlots.map((time) => {
              const isOccupied = !availableSlots.includes(time);

              if (isOccupied) {
                return (
                  <Button
                    key={time}
                    type="button"
                    variant="outline"
                    disabled
                    title="Este horario está ocupado"
                    className={cn(
                      'h-auto min-h-[44px] py-2 text-sm w-full',
                      'bg-muted/50 text-muted-foreground',
                      'border-muted-foreground/20',
                      'cursor-not-allowed opacity-75'
                    )}
                  >
                    {formatTimeDisplay(time)} (Ocupado)
                  </Button>
                );
              }

              const isSelected = selectedSlot?.startTime === time;
              const containingRange = findContainingRange(time);

              return (
                <div
                  key={time}
                  className={cn(
                    'flex gap-2 transition-all duration-300 w-full',
                    isSelected ? 'flex-row' : 'flex-col sm:flex-row'
                  )}
                >
                  <Button
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => {
                      if (containingRange) {
                        const endTime = calculateEndTime(time);
                        onSlotSelect({
                          startTime: time,
                          endTime,
                        });
                      }
                    }}
                    className={cn(
                      'h-auto min-h-[44px] py-2 text-sm transition-all duration-300',
                      isSelected
                        ? 'bg-primary text-primary-foreground flex-1'
                        : 'w-full'
                    )}
                  >
                    {formatTimeDisplay(time)}
                  </Button>

                  {isSelected && isSelectedSlotAvailable && onConfirmBooking && (
                    <Button
                      type="button"
                      onClick={handleConfirmClick}
                      disabled={isLoading}
                      className={cn(
                        'min-h-[44px] flex-1',
                        'animate-in fade-in slide-in-from-right-2',
                        'duration-300 ease-out'
                      )}
                      size="default"
                    >
                      {isLoading ? 'Confirmando...' : 'Confirmar'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Confirmation dialog */}
          {selectedSlot && (
            <AppointmentConfirmationDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onConfirm={handleDialogConfirm}
              date={selectedDate}
              startTime={selectedSlot.startTime}
              endTime={selectedSlot.endTime}
              professionalName={professionalName}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}
