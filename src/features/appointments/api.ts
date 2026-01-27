import { apiClient } from '@/services/api-client';
import type {
  AppointmentDTO,
  AppointmentResponseDTO,
  AppointmentsListResponseDTO,
  CreateAppointmentRequestDTO,
} from '@/shared/dtos/appointment.dto';

/**
 * Appointments API endpoints
 * Placeholder implementation for future booking functionality
 */
export const appointmentsApi = {
  /**
   * Get appointments for a professional (placeholder)
   * @param professionalId - The professional's ID
   * @param startDate - Start date for filtering (ISO string)
   * @param endDate - End date for filtering (ISO string)
   */
  getProfessionalAppointments: async (
    professionalId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AppointmentDTO[]> => {
    // TODO: Implement when backend is ready
    // const params = new URLSearchParams();
    // if (startDate) params.append('startDate', startDate);
    // if (endDate) params.append('endDate', endDate);
    // const response = await apiClient.get<AppointmentsListResponseDTO>(
    //   `/appointments/professional/${professionalId}?${params.toString()}`
    // );
    // return response.data.data.appointments;
    
    // Placeholder: return empty array
    return [];
  },

  /**
   * Get appointments for a specific date range (placeholder)
   * @param professionalId - The professional's ID
   * @param date - Date to check (ISO string YYYY-MM-DD)
   */
  getAppointmentsByDate: async (
    professionalId: string,
    date: string
  ): Promise<AppointmentDTO[]> => {
    // TODO: Implement when backend is ready
    // const response = await apiClient.get<AppointmentsListResponseDTO>(
    //   `/appointments/professional/${professionalId}?date=${date}`
    // );
    // return response.data.data.appointments;
    
    // Placeholder: return empty array
    return [];
  },

  /**
   * Create a new appointment (placeholder)
   */
  createAppointment: async (
    data: CreateAppointmentRequestDTO
  ): Promise<AppointmentDTO> => {
    // TODO: Implement when backend is ready
    // const response = await apiClient.post<AppointmentResponseDTO>(
    //   '/appointments',
    //   data
    // );
    // return response.data.data;
    
    // Placeholder: throw error to indicate not implemented
    throw new Error('Appointment creation not yet implemented');
  },
};
