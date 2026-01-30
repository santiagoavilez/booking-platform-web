import { Card, CardContent } from '@/components/ui/card';

interface ProfessionalsEmptyStateProps {
  hasSearch: boolean;
}

/**
 * Empty state when no professionals match the list/search
 */
export function ProfessionalsEmptyState({ hasSearch }: ProfessionalsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-8 pt-6">
        <div className="py-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="mb-2 text-lg font-medium">
            {hasSearch ? 'No se encontraron profesionales' : 'No hay profesionales'}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasSearch
              ? 'Ajusta la búsqueda o intenta con otros términos.'
              : 'No hay profesionales disponibles en este momento.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
