import { useQuery } from '@tanstack/react-query';
import { professionalsApi } from './api';

const PROFESSIONALS_PAGE_LIMIT = 6;

/**
 * Hook to fetch paginated professionals with optional search
 * Application layer: orchestration only; URL is owned by the page
 */
export function useProfessionalsSearch(search: string, page: number) {
  return useQuery({
    queryKey: ['professionals', 'list', search, page],
    queryFn: () =>
      professionalsApi.getProfessionals({
        search: search || undefined,
        page,
        limit: PROFESSIONALS_PAGE_LIMIT,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
