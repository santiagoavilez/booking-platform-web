import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks';
import { useMyAvailability, useUpdateAvailability } from '../hooks';
import { DaySchedule } from '../components/DaySchedule';
import type { DayAvailabilityDTO } from '@/shared/dtos/availability.dto';
import {
  createDefaultAvailability,
  doTimeSlotsOverlap,
  isValidTimeRange,
  DayOfWeek,
} from '@/shared/dtos/availability.dto';
import { toast } from 'sonner';

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: savedSchedule, isLoading: isLoadingSchedule } = useMyAvailability();
  const updateMutation = useUpdateAvailability();

  // Local state for the form
  const [schedule, setSchedule] = useState<DayAvailabilityDTO[]>(createDefaultAvailability);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with server data
  useEffect(() => {
    // Sync with savedSchedule only if it's different
    if (
      savedSchedule &&
      JSON.stringify(savedSchedule) !== JSON.stringify(schedule)
    ) {
      setSchedule(savedSchedule);
      setHasChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSchedule]);

  // Redirect non-professionals
  if (user?.role !== 'PROFESSIONAL') {
    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Esta sección es solo para profesionales.
            </p>
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateDay = (dayOfWeek: DayOfWeek, updated: DayAvailabilityDTO) => {
    setSchedule((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? updated : day))
    );
    setHasChanges(true);
  };

  const handleApplyToAll = (sourceDayOfWeek: DayOfWeek) => {
    const sourceDay = schedule.find((d) => d.dayOfWeek === sourceDayOfWeek);
    if (!sourceDay) return;

    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        enabled: sourceDay.enabled,
        timeSlots: [...sourceDay.timeSlots],
      }))
    );
    setHasChanges(true);
  };

  const validateSchedule = (): boolean => {
    for (const day of schedule) {
      if (!day.enabled) continue;

      // Check each time slot
      for (const slot of day.timeSlots) {
        if (!isValidTimeRange(slot.startTime, slot.endTime)) {
          return false;
        }
      }

      // Check for overlaps between slots
      if (day.timeSlots.length > 1) {
        if (doTimeSlotsOverlap(day.timeSlots[0], day.timeSlots[1])) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSchedule()) {
      return;
    }

    try {
      await updateMutation.mutateAsync(schedule);
      setHasChanges(false);
      toast.success('Horarios guardados correctamente');
    } catch (error) {
      console.error('Failed to save availability:', error);
      toast.error('Error al guardar los horarios. Por favor, intenta de nuevo.');
    }
  };

  const isValid = validateSchedule();
  const canSave = hasChanges && isValid && !updateMutation.isPending;

  // Sort days starting from Monday
  const sortedSchedule = [...schedule].sort((a, b) => {
    // Move Sunday (0) to the end
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-3 py-3 md:px-6 md:py-4">
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
              Horarios de Disponibilidad
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            size="sm"
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 size-4" />
            )}
            <span className="hidden sm:inline">Guardar</span>
            <span className="sm:hidden">Guardar</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-3 py-3 md:px-6 md:py-5">
        {isLoadingSchedule ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {/* Info card - more compact */}
            <Card className="bg-muted/30">
              <CardContent className="flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="size-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Configura tus horarios disponibles para citas. Máximo 2 rangos por día.
                </p>
              </CardContent>
            </Card>

            {/* Days schedule */}
            <div className="space-y-2 md:space-y-3">
              {sortedSchedule.map((dayAvailability) => (
                <DaySchedule
                  key={dayAvailability.dayOfWeek}
                  dayAvailability={dayAvailability}
                  onUpdate={(updated) =>
                    handleUpdateDay(dayAvailability.dayOfWeek, updated)
                  }
                  onApplyToAll={() => handleApplyToAll(dayAvailability.dayOfWeek)}
                />
              ))}
            </div>

            {/* Status messages - more compact */}
            {updateMutation.isSuccess && !hasChanges && (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950">
                <p className="text-xs text-green-700 dark:text-green-300">
                  ✓ Horarios guardados correctamente
                </p>
              </div>
            )}

            {updateMutation.isError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                <p className="text-xs text-destructive">
                  Error al guardar. Por favor, intenta de nuevo.
                </p>
              </div>
            )}

            {!isValid && hasChanges && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Revisa los horarios marcados en rojo antes de guardar.
                </p>
              </div>
            )}

            {/* Mobile save button */}
            <div className="sticky bottom-3 pt-1 md:hidden">
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="w-full shadow-lg"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Save className="mr-1.5 size-4" />
                )}
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

