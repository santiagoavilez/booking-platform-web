import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityApi } from './api';
import type {
  DayAvailabilityDTO,
  UpdateAvailabilityRequestDTO,
} from '@/shared/dtos/availability.dto';
import {
  createDefaultAvailability,
  transformAvailabilitySlotsToSchedule,
} from '@/shared/dtos/availability.dto';

const AVAILABILITY_QUERY_KEY = ['availability', 'me'];

/**
 * Hook to fetch the current professional's availability
 */
export function useMyAvailability() {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEY,
    queryFn: availabilityApi.getMyAvailability,
    select: (response) => {
      // Transform backend slots to DayAvailabilityDTO format
      const slots = response.data.availabilities || [];
      
      // If no slots exist, return placeholder schedule
      if (slots.length === 0) {
        return createDefaultAvailability();
      }
      
      return transformAvailabilitySlotsToSchedule(slots);
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
    retry: false, // Don't retry on error for public pages
    throwOnError: false, // Let component handle errors
    staleTime: 1000 * 60 * 5, // 5 minutes - handle 304 Not Modified
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
  });
}

