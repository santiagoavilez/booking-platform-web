import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TimeSlotDTO } from '@/shared/dtos/availability.dto';
import {
  generateTimeOptions,
  formatTimeDisplay,
  isValidTimeRange,
} from '@/shared/dtos/availability.dto';

interface TimeRangeSelectorProps {
  slot: TimeSlotDTO;
  index: number;
  onUpdate: (index: number, slot: TimeSlotDTO) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  disabled?: boolean;
  otherSlot?: TimeSlotDTO;
}

const timeOptions = generateTimeOptions();

export function TimeRangeSelector({
  slot,
  index,
  onUpdate,
  onRemove,
  canRemove,
  disabled,
  otherSlot,
}: TimeRangeSelectorProps) {
  const hasError = !isValidTimeRange(slot.startTime, slot.endTime);

  // Check if time conflicts with other slot
  const hasOverlapError = otherSlot
    ? (() => {
        const start1 = parseInt(slot.startTime.replace(':', ''), 10);
        const end1 = parseInt(slot.endTime.replace(':', ''), 10);
        const start2 = parseInt(otherSlot.startTime.replace(':', ''), 10);
        const end2 = parseInt(otherSlot.endTime.replace(':', ''), 10);
        return start1 < end2 && start2 < end1;
      })()
    : false;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Start time */}
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Apertura
          </label>
          <Select
            value={slot.startTime}
            onValueChange={(value: string) =>
              onUpdate(index, { ...slot, startTime: value })
            }
            disabled={disabled}
          >
            <SelectTrigger className={hasError ? 'border-destructive' : ''}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <SelectValue>
                  {formatTimeDisplay(slot.startTime)}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {formatTimeDisplay(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End time */}
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Cierre
          </label>
          <Select
            value={slot.endTime}
            onValueChange={(value: string) =>
              onUpdate(index, { ...slot, endTime: value })
            }
            disabled={disabled}
          >
            <SelectTrigger className={hasError ? 'border-destructive' : ''}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <SelectValue>
                  {formatTimeDisplay(slot.endTime)}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {formatTimeDisplay(time)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remove button */}
        {canRemove && (
          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar horario</span>
            </Button>
          </div>
        )}
      </div>

      {/* Error messages */}
      {hasError && (
        <p className="text-xs text-destructive">
          La hora de apertura debe ser anterior a la de cierre
        </p>
      )}
      {hasOverlapError && (
        <p className="text-xs text-destructive">
          Los horarios no pueden solaparse
        </p>
      )}
    </div>
  );
}

