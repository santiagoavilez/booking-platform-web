import { Briefcase, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDisplayDate, formatDisplayTime } from '@/lib/date-time.utils';
import type { AppointmentDTO, AppointmentStatus } from '@/shared/dtos/appointment.dto';
import { AppointmentStatus as StatusEnum } from '@/shared/dtos/appointment.dto';
import { cn } from '@/lib/utils';

/** Spanish labels for appointment status */
const STATUS_LABELS: Record<AppointmentStatus, string> = {
  [StatusEnum.PENDING]: 'Pendiente',
  [StatusEnum.CONFIRMED]: 'Confirmada',
  [StatusEnum.CANCELLED]: 'Cancelada',
  [StatusEnum.COMPLETED]: 'Completada',
};

/** Tailwind classes for status badge */
const STATUS_COLORS: Record<AppointmentStatus, string> = {
  [StatusEnum.PENDING]: 'bg-yellow-500/20 text-yellow-500',
  [StatusEnum.CONFIRMED]: 'bg-green-500/20 text-green-500',
  [StatusEnum.CANCELLED]: 'bg-red-500/20 text-red-500',
  [StatusEnum.COMPLETED]: 'bg-blue-500/20 text-blue-500',
};

function getFullName(firstName: string, lastName: string): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim() || '—';
}

function getStatusLabel(status?: AppointmentStatus): string {
  return status ? STATUS_LABELS[status] : 'Pendiente';
}

function getStatusColor(status?: AppointmentStatus): string {
  return status ? STATUS_COLORS[status] : 'bg-yellow-500/20 text-yellow-500';
}

/**
 * Single appointment card with professional, client and schedule.
 * Uses icons for professional, client and time (Clean Architecture: UI layer).
 */
export function AppointmentCard({ appointment }: { appointment: AppointmentDTO }) {
  const professionalName = appointment.professional
    ? getFullName(appointment.professional.firstName, appointment.professional.lastName)
    : appointment.professionalId;
  const clientName = appointment.client
    ? getFullName(appointment.client.firstName, appointment.client.lastName)
    : appointment.clientId;
  const timeRange = `${formatDisplayTime(appointment.startTime)} - ${formatDisplayTime(appointment.endTime)}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            {formatDisplayDate(appointment.date)}
          </CardTitle>
          {appointment.status && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                getStatusColor(appointment.status)
              )}
            >
              {getStatusLabel(appointment.status)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Briefcase
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Profesional
            </p>
            <p className="text-sm font-medium">{professionalName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cliente
            </p>
            <p className="text-sm font-medium">{clientName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Horario
            </p>
            <p className="text-sm font-medium">{timeRange}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
