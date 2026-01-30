import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfessionalsSearch } from '../hooks';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { ProfessionalCardSkeleton } from '../components/ProfessionalCardSkeleton';
import { ProfessionalsEmptyState } from '../components/ProfessionalsEmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SKELETON_COUNT = 6;

function parsePage(value: string | null): number {
  const n = parseInt(value ?? '1', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/**
 * Search Professionals Page
 * URL-driven search (search, page) and paginated list. Available to all authenticated users.
 */
export default function SearchProfessionalsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') ?? '';
  const pageFromUrl = parsePage(searchParams.get('page'));

  const [inputValue, setInputValue] = useState(searchFromUrl);

  useEffect(() => {
    setInputValue(searchFromUrl);
  }, [searchFromUrl]);

  const { data, isLoading, error } = useProfessionalsSearch(searchFromUrl, pageFromUrl);

  const professionals = data?.professionals ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = Math.min(pageFromUrl, Math.max(1, totalPages));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = inputValue.trim();
      setSearchParams(value ? { search: value, page: '1' } : { page: '1' });
    },
    [inputValue, setSearchParams]
  );

  const handlePrev = useCallback(() => {
    if (!hasPrev) return;
    const params: Record<string, string> = { page: String(currentPage - 1) };
    if (searchFromUrl) params.search = searchFromUrl;
    setSearchParams(params);
  }, [hasPrev, currentPage, searchFromUrl, setSearchParams]);

  const handleNext = useCallback(() => {
    if (!hasNext) return;
    const params: Record<string, string> = { page: String(currentPage + 1) };
    if (searchFromUrl) params.search = searchFromUrl;
    setSearchParams(params);
  }, [hasNext, currentPage, searchFromUrl, setSearchParams]);

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="h-8 w-8 min-h-[44px] min-w-[44px] p-0 md:h-8 md:w-8 md:min-h-0 md:min-w-0"
              aria-label="Volver"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Buscar profesionales
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <Label htmlFor="professionals-search" className="sr-only">
            Buscar por nombre o apellido
          </Label>
          <div className="flex gap-2">
            <Input
              id="professionals-search"
              type="search"
              placeholder="Nombre o apellido (ej: santiago avilez)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-h-[44px] flex-1"
              aria-label="Buscar por nombre o apellido"
            />
            <Button type="submit" className="min-h-[44px] min-w-[44px] px-4">
              Buscar
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ProfessionalCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Error al cargar profesionales</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No se pudieron cargar los profesionales. Por favor, intenta de nuevo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && data && (
          <>
            {professionals.length === 0 ? (
              <ProfessionalsEmptyState hasSearch={searchFromUrl.length > 0} />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {professionals.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-6 flex items-center justify-center gap-2"
                    aria-label="Paginación"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                      disabled={!hasPrev}
                      className="min-h-[44px] min-w-[44px]"
                      aria-label="Página anterior"
                    >
                      Anterior
                    </Button>
                    <span className="min-h-[44px] px-2 py-2 text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={!hasNext}
                      className="min-h-[44px] min-w-[44px]"
                      aria-label="Página siguiente"
                    >
                      Siguiente
                    </Button>
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
