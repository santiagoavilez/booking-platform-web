import { Button } from '@/components/ui/button';
import { formatTimeDisplay } from '@/shared/dtos/availability.dto';
import type { TimeSlotDTO } from '@/shared/dtos/availability.dto';

interface TimeSlotsListProps {
  slots: TimeSlotDTO[];
  selectedSlot: TimeSlotDTO | null;
  onSlotSelect: (slot: TimeSlotDTO) => void;
  date: Date;
}

/**
 * Generate time slots from a range (e.g., 09:00-17:00 generates slots every hour)
 */
function generateTimeSlotsFromRange(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return slots;
}

export function TimeSlotsList({
  slots,
  selectedSlot,
  onSlotSelect,
  date,
}: TimeSlotsListProps) {
  // Generate all available time slots from the ranges
  const allTimeSlots: string[] = [];
  
  for (const slot of slots) {
    const hourSlots = generateTimeSlotsFromRange(slot.startTime, slot.endTime);
    allTimeSlots.push(...hourSlots);
  }

  // Remove duplicates and sort
  const uniqueSlots = Array.from(new Set(allTimeSlots)).sort((a, b) => {
    return a.localeCompare(b);
  });

  if (uniqueSlots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No hay horarios disponibles para este día
        </p>
      </div>
    );
  }

  const formatDateDisplay = (date: Date): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-base font-semibold md:text-lg">
        {formatDateDisplay(date)}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
        {uniqueSlots.map((time) => {
          // Find the slot range this time belongs to
          const slotRange = slots.find(
            (s) => time >= s.startTime && time < s.endTime
          );
          
          if (!slotRange) return null;

          // Calculate end time (1 hour after start)
          const [hour] = time.split(':').map(Number);
          const endHour = (hour + 1) % 24;
          const endTime = `${endHour.toString().padStart(2, '0')}:00`;

          const slot: TimeSlotDTO = {
            startTime: time,
            endTime: endTime,
          };

          const isSelected =
            selectedSlot?.startTime === slot.startTime &&
            selectedSlot?.endTime === slot.endTime;

          return (
            <Button
              key={time}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onSlotSelect(slot)}
              className="h-auto py-2.5 text-sm"
            >
              {formatTimeDisplay(time)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
