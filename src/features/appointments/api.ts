import { apiClient } from '@/services/api-client';
import type {
  AppointmentDTO,
  AppointmentResponseDTO,
  AppointmentsListResponseDTO,
  CreateAppointmentRequestDTO,
  MyAppointmentsResponseDTO,
} from '@/shared/dtos/appointment.dto';

/**
 * Appointments API endpoints
 * Follows Clean Architecture: Infrastructure layer for external API communication
 */
export const appointmentsApi = {
  /**
   * Get appointments for a professional within a date range
   * @param professionalId - The professional's ID
   * @param startDate - Start date for filtering (ISO string YYYY-MM-DD)
   * @param endDate - End date for filtering (ISO string YYYY-MM-DD)
   */
  getProfessionalAppointments: async (
    professionalId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AppointmentDTO[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get<AppointmentsListResponseDTO>(
      `/appointments/professional/${professionalId}?${params.toString()}`
    );
    const raw = response.data.data;
    return (Array.isArray(raw) ? raw : raw?.appointments) ?? [];
  },

  /**
   * Get appointments for a specific date
   * Optimized endpoint for checking availability on a single date
   * @param professionalId - The professional's ID
   * @param date - Date to check (ISO string YYYY-MM-DD)
   */
  getAppointmentsByDate: async (
    professionalId: string,
    date: string
  ): Promise<AppointmentDTO[]> => {
    const response = await apiClient.get<AppointmentsListResponseDTO>(
      `/appointments/professional/${professionalId}?date=${date}`
    );
    const raw = response.data.data;
    return (Array.isArray(raw) ? raw : raw?.appointments) ?? [];
  },

  /**
   * Create a new appointment
   * @param data - Appointment creation data
   */
  createAppointment: async (
    data: CreateAppointmentRequestDTO
  ): Promise<AppointmentDTO> => {
    const response = await apiClient.post<AppointmentResponseDTO>(
      '/appointments',
      data
    );
    return response.data.data;
  },

  /**
   * Get appointments for the authenticated user (as client)
   * Returns appointments for the current user
   */
  getMyAppointments: async (): Promise<AppointmentDTO[]> => {
    const response = await apiClient.get<MyAppointmentsResponseDTO>(
      '/appointments'
    );
    return response.data.data;
  },
};
