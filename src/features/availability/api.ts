import { apiClient } from '@/services/api-client';
import type {
  AvailabilityResponseDTO,
  AvailabilitySlotDTO,
  UpdateAvailabilityRequestDTO,
  WeeklyAvailabilityDTO,
} from '@/shared/dtos/availability.dto';
import { transformAvailabilitySlotsToSchedule } from '@/shared/dtos/availability.dto';

/**
 * Availability API endpoints
 */
export const availabilityApi = {
  /**
   * Get the current user's availability schedule
   */
  getMyAvailability: async (): Promise<AvailabilityResponseDTO> => {
    const response = await apiClient.get<AvailabilityResponseDTO>('/availability/me');
    return response.data;
  },

  /**
   * Update the current user's availability schedule
   */
  updateMyAvailability: async (
    data: UpdateAvailabilityRequestDTO
  ): Promise<AvailabilityResponseDTO> => {
    const response = await apiClient.post<AvailabilityResponseDTO>('/availability/me', data);
    return response.data;
  },

  /**
   * Get a professional's availability by their ID (for clients to view)
   */
  getProfessionalAvailability: async (
    professionalId: string
  ): Promise<WeeklyAvailabilityDTO> => {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        availabilities: AvailabilitySlotDTO[];
        professional?: {
          firstName: string;
          lastName: string;
        };
      };
    }>(`/availability/${professionalId}`);
    
    // Transform backend response to WeeklyAvailabilityDTO
    const slots = response.data.data.availabilities || [];
    const schedule = transformAvailabilitySlotsToSchedule(slots);
    const professional = response.data.data.professional;
    
    return {
      professionalId,
      professionalFirstName: professional?.firstName,
      professionalLastName: professional?.lastName,
      schedule,
    };
  },
};

