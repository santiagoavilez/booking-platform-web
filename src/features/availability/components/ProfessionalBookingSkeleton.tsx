import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfessionalBookingSkeleton() {
  return (
    <div className="min-h-svh">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 md:px-6 md:py-4">
          <Skeleton className="size-9 shrink-0 rounded-md" />
          <Skeleton className="h-6 w-48" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left section - Professional info */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/30">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {/* Avatar skeleton */}
                  <div className="flex justify-center">
                    <Skeleton className="size-20 rounded-full" />
                  </div>
                  
                  {/* Name skeleton */}
                  <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-6 w-32" />
                    <Skeleton className="mx-auto h-4 w-24" />
                  </div>
                  
                  {/* Info bars skeleton */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle section - Calendar */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/30">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {/* Calendar header skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                  
                  {/* Calendar grid skeleton */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-md" />
                      ))}
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <Skeleton key={j} className="aspect-square rounded-md" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right section - Time slots */}
          <div className="lg:col-span-1">
            <Card className="bg-muted/30">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {/* Date header skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  
                  {/* Time slots skeleton */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:flex md:flex-col">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-11 w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
