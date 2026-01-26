import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityApi } from './api';
import type {
  DayAvailabilityDTO,
  UpdateAvailabilityRequestDTO,
} from '@/shared/dtos/availability.dto';
import { createDefaultAvailability } from '@/shared/dtos/availability.dto';

const AVAILABILITY_QUERY_KEY = ['availability', 'me'];

/**
 * Hook to fetch the current professional's availability
 */
export function useMyAvailability() {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEY,
    queryFn: availabilityApi.getMyAvailability,
    select: (response) => response.data.schedule,
    // Provide default availability if API returns empty
    placeholderData: {
      success: true,
      data: {
        professionalId: '',
        schedule: createDefaultAvailability(),
      },
    },
  });
}

/**
 * Hook to update the professional's availability
 */
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: DayAvailabilityDTO[]) => {
      const request: UpdateAvailabilityRequestDTO = { schedule };
      return availabilityApi.updateMyAvailability(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEY });
    },
  });
}

/**
 * Hook to fetch a specific professional's availability (for clients)
 */
export function useProfessionalAvailability(professionalId: string) {
  return useQuery({
    queryKey: ['availability', professionalId],
    queryFn: () => availabilityApi.getProfessionalAvailability(professionalId),
    enabled: !!professionalId,
  });
}

