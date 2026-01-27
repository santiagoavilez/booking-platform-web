import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DayScheduleSkeleton() {
  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-2.5">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Time slots skeleton */}
          <div className="space-y-2.5 pl-0 md:pl-9">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <span className="text-muted-foreground">-</span>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="ml-auto h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-full border-dashed" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
