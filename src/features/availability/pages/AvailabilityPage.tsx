import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-svh bg-linear-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">
              Horarios de Disponibilidad
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            size="sm"
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        {isLoadingSchedule ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Configura tu disponibilidad semanal
                    </CardTitle>
                    <CardDescription>
                      Define los horarios en los que estás disponible para recibir citas.
                      Puedes agregar hasta 2 rangos por día.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Days schedule */}
            <div className="space-y-4">
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

            {/* Status messages */}
            {updateMutation.isSuccess && !hasChanges && (
              <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CardContent className="py-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Horarios guardados correctamente
                  </p>
                </CardContent>
              </Card>
            )}

            {updateMutation.isError && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="py-3">
                  <p className="text-sm text-destructive">
                    Error al guardar. Por favor, intenta de nuevo.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isValid && hasChanges && (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <CardContent className="py-3">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Revisa los horarios marcados en rojo antes de guardar.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mobile save button */}
            <div className="sticky bottom-4 md:hidden">
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="w-full shadow-lg"
                size="lg"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
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

