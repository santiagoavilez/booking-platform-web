import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton placeholder matching ProfessionalCard layout
 */
export function ProfessionalCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <Skeleton className="mb-3 h-12 w-12 shrink-0 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-40" />
        <Skeleton className="mt-4 h-11 w-full min-w-[120px] max-w-[160px] rounded-md" />
      </CardContent>
    </Card>
  );
}
