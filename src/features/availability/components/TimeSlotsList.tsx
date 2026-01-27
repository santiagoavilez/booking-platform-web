import { Button } from '@/components/ui/button';
import { formatTimeDisplay } from '@/shared/dtos/availability.dto';
import type { TimeSlotDTO } from '@/shared/dtos/availability.dto';
import type { AppointmentDTO } from '@/shared/dtos/appointment.dto';
import { cn } from '@/lib/utils';
import {
  generateTimeSlotsFromRanges,
  filterAvailableTimeSlots,
} from '@/lib/availability-utils';

interface TimeSlotsListProps {
  selectedDate: Date;
  timeSlots: TimeSlotDTO[];
  selectedSlot: TimeSlotDTO | null;
  onSlotSelect: (slot: TimeSlotDTO) => void;
  appointments?: AppointmentDTO[]; // Optional: appointments to mark slots as occupied
}

export function TimeSlotsList({
  selectedDate,
  timeSlots,
  selectedSlot,
  onSlotSelect,
  appointments = [],
}: TimeSlotsListProps) {
  const dayName = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateStr = selectedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  // Generate all time slots from ranges
  const allSlots = generateTimeSlotsFromRanges(timeSlots);
  
  // Filter out occupied slots
  const availableSlots = filterAvailableTimeSlots(allSlots, selectedDate, appointments);
  
  // Get occupied slots for display
  const occupiedSlots = allSlots.filter(
    (slot) => !availableSlots.includes(slot)
  );

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

      {availableSlots.length === 0 && occupiedSlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay horarios disponibles para este día.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-col">
          {/* Available slots */}
          {availableSlots.map((time) => {
            const isSelected = selectedSlot?.startTime === time;
            const containingRange = findContainingRange(time);

            return (
              <Button
                key={time}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => {
                  if (containingRange) {
                    // Calculate end time as 1 hour after start time
                    const endTime = calculateEndTime(time);
                    onSlotSelect({
                      startTime: time,
                      endTime,
                    });
                  }
                }}
                className={cn(
                  'h-auto min-h-[44px] py-2 text-sm',
                  isSelected && 'bg-primary text-primary-foreground'
                )}
              >
                {formatTimeDisplay(time)}
              </Button>
            );
          })}

          {/* Occupied slots (disabled) */}
          {occupiedSlots.map((time) => (
            <Button
              key={time}
              type="button"
              variant="outline"
              disabled
              className="h-auto min-h-[44px] py-2 text-sm opacity-50 cursor-not-allowed"
            >
              {formatTimeDisplay(time)} (Ocupado)
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
