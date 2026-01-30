import { apiClient } from '@/services/api-client';
import type {
  ProfessionalDTO,
  ProfessionalsListResponseDTO,
} from '@/shared/dtos/professional.dto';

export interface GetProfessionalsParams {
  search?: string;
  page: number;
  limit: number;
}

export interface GetProfessionalsResult {
  professionals: ProfessionalDTO[];
  total: number;
}

/**
 * Professionals API endpoints
 * Infrastructure layer for external API communication
 */
export const professionalsApi = {
  /**
   * Get paginated list of professionals with optional search
   */
  getProfessionals: async (
    params: GetProfessionalsParams
  ): Promise<GetProfessionalsResult> => {
    const searchParams = new URLSearchParams();
    if (params.search?.trim()) searchParams.set('search', params.search.trim());
    searchParams.set('page', String(params.page));
    searchParams.set('limit', String(params.limit));

    const response = await apiClient.get<ProfessionalsListResponseDTO>(
      `/professionals?${searchParams.toString()}`
    );

    const data = response.data.data;
    return {
      professionals: data?.professionals ?? [],
      total: data?.total ?? 0,
    };
  },
};
