import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from './api';
import type { AppointmentDTO } from '@/shared/dtos/appointment.dto';

/**
 * Hook to fetch appointments for a professional
 * Placeholder implementation for future booking functionality
 */
export function useProfessionalAppointments(
  professionalId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery<AppointmentDTO[]>({
    queryKey: ['appointments', 'professional', professionalId, startDate, endDate],
    queryFn: () => appointmentsApi.getProfessionalAppointments(professionalId, startDate, endDate),
    enabled: !!professionalId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch appointments for a specific date
 * Placeholder implementation for future booking functionality
 */
export function useAppointmentsByDate(professionalId: string, date: string) {
  return useQuery<AppointmentDTO[]>({
    queryKey: ['appointments', 'professional', professionalId, 'date', date],
    queryFn: () => appointmentsApi.getAppointmentsByDate(professionalId, date),
    enabled: !!professionalId && !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
