import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { TimeRangeSelector } from './TimeRangeSelector';
import type { DayAvailabilityDTO, TimeSlotDTO } from '@/shared/dtos/availability.dto';
import { DAY_NAMES, DayOfWeek } from '@/shared/dtos/availability.dto';

interface DayScheduleProps {
  dayAvailability: DayAvailabilityDTO;
  onUpdate: (updated: DayAvailabilityDTO) => void;
  onApplyToAll?: () => void;
}

const MAX_TIME_SLOTS = 2;

export function DaySchedule({
  dayAvailability,
  onUpdate,
  onApplyToAll,
}: DayScheduleProps) {
  const { dayOfWeek, enabled, timeSlots } = dayAvailability;
  const dayName = DAY_NAMES[dayOfWeek as DayOfWeek];
  const canAddSlot = timeSlots.length < MAX_TIME_SLOTS;

  const handleToggle = (checked: boolean) => {
    onUpdate({
      ...dayAvailability,
      enabled: checked,
      // Add default time slot when enabling
      timeSlots: checked && timeSlots.length === 0
        ? [{ startTime: '09:00', endTime: '17:00' }]
        : timeSlots,
    });
  };

  const handleUpdateSlot = (index: number, updatedSlot: TimeSlotDTO) => {
    const newSlots = [...timeSlots];
    newSlots[index] = updatedSlot;
    onUpdate({ ...dayAvailability, timeSlots: newSlots });
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    onUpdate({ ...dayAvailability, timeSlots: newSlots });
  };

  const handleAddSlot = () => {
    if (!canAddSlot) return;

    // Suggest a time after the last slot
    const lastSlot = timeSlots[timeSlots.length - 1];
    const lastEndHour = parseInt(lastSlot?.endTime?.split(':')[0] ?? '12', 10);
    const suggestedStart = `${Math.min(lastEndHour + 1, 20).toString().padStart(2, '0')}:00`;
    const suggestedEnd = `${Math.min(lastEndHour + 5, 23).toString().padStart(2, '0')}:00`;

    onUpdate({
      ...dayAvailability,
      timeSlots: [...timeSlots, { startTime: suggestedStart, endTime: suggestedEnd }],
    });
  };

  return (
    <Card className={!enabled ? 'opacity-60' : ''}>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-2.5">
          {/* Header with toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                aria-label={`Activar ${dayName}`}
              />
              <span className="text-sm font-semibold">{dayName}</span>
            </div>

            {/* Apply to all button */}
            {onApplyToAll && enabled && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onApplyToAll}
                className="h-auto px-0 py-0 text-[11px] text-muted-foreground hover:text-primary"
              >
                Aplicar a todos
              </Button>
            )}
          </div>

          {/* Time slots */}
          {enabled && (
            <div className="space-y-2.5 pl-0 md:pl-9">
              {timeSlots.map((slot, index) => (
                <TimeRangeSelector
                  key={index}
                  slot={slot}
                  index={index}
                  onUpdate={handleUpdateSlot}
                  onRemove={handleRemoveSlot}
                  canRemove={timeSlots.length > 1}
                  disabled={!enabled}
                  otherSlot={timeSlots.length > 1 ? timeSlots[index === 0 ? 1 : 0] : undefined}
                />
              ))}

              {/* Add second slot button */}
              {canAddSlot && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSlot}
                  className="h-8 w-full border-dashed text-xs"
                >
                  <Plus className="mr-1.5 size-3.5" />
                  Agregar segundo horario
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

