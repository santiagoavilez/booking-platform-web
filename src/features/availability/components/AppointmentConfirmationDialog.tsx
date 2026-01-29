import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatTimeDisplay } from '@/shared/dtos/availability.dto';

interface AppointmentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  date: Date;
  startTime: string;
  endTime: string;
  professionalName?: string;
  isLoading?: boolean;
}

/**
 * Appointment Confirmation Dialog
 * 
 * Displays a confirmation dialog before creating an appointment.
 * Warns the user that the action is irreversible.
 * Follows Clean Architecture: UI layer for user interaction
 */
export function AppointmentConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  date,
  startTime,
  endTime,
  professionalName,
  isLoading = false,
}: AppointmentConfirmationDialogProps) {
  const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
  const dateStr = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedStartTime = formatTimeDisplay(startTime);
  const formattedEndTime = formatTimeDisplay(endTime);

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar reserva</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              <p className="font-medium text-foreground">Detalles de la reserva:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>Fecha:</strong> {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
                </li>
                <li>
                  <strong>Horario:</strong> {formattedStartTime} - {formattedEndTime}
                </li>
                {professionalName && (
                  <li>
                    <strong>Profesional:</strong> {professionalName}
                  </li>
                )}
              </ul>
            </div>
            <p className="pt-2 text-sm font-medium text-destructive">
              Esta acción es irreversible. ¿Estás seguro de que deseas reservar esta cita?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Confirmando...' : 'Confirmar reserva'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
