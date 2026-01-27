import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfessionalBookingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {/* Left column - Professional info skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Avatar skeleton */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                {/* Info lines skeleton */}
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle column - Calendar skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-48" />

                {/* Month navigation skeleton */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>

                {/* Calendar grid skeleton */}
                <div className="space-y-2">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={`header-${i}`} className="h-6 w-full" />
                    ))}
                  </div>
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <Skeleton key={`day-${i}`} className="aspect-square w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Time slots skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-40" />

                {/* Time slots grid skeleton */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={`slot-${i}`} className="h-10 w-full rounded-md" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
