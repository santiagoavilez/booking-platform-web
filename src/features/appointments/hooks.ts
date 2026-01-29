import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from './api';
import type { AppointmentDTO, CreateAppointmentRequestDTO } from '@/shared/dtos/appointment.dto';

/**
 * Hook to fetch appointments for a professional within a date range
 * Follows Clean Architecture: Application layer for business logic orchestration
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
    staleTime: 1000 * 60 * 5, // 5 minutes - appointments change frequently
  });
}

/**
 * Hook to fetch appointments for a specific date
 * Optimized for checking availability on a single date
 * Follows Clean Architecture: Application layer for business logic orchestration
 */
export function useAppointmentsByDate(professionalId: string, date: string) {
  return useQuery<AppointmentDTO[]>({
    queryKey: ['appointments', 'professional', professionalId, 'date', date],
    queryFn: () => appointmentsApi.getAppointmentsByDate(professionalId, date),
    enabled: !!professionalId && !!date,
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter cache for date-specific queries
  });
}

/**
 * Hook to create a new appointment
 * Invalidates related queries to refresh availability display
 * Follows Clean Architecture: Application layer for business logic orchestration
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequestDTO) => 
      appointmentsApi.createAppointment(data),
    onSuccess: (appointment) => {
      // Invalidate appointments queries for the professional
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', 'professional', appointment.professionalId] 
      });
      
      // Invalidate availability queries to refresh slot display
      queryClient.invalidateQueries({ 
        queryKey: ['availability', appointment.professionalId] 
      });
    },
  });
}
