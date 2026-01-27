import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BookingErrorStateProps {
  title: string;
  message: string;
  onBack: () => void;
  variant?: 'error' | 'warning';
}

export function BookingErrorState({
  title,
  message,
  onBack,
  variant = 'error',
}: BookingErrorStateProps) {
  const isWarning = variant === 'warning';

  return (
    <Card
      className={
        isWarning
          ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
          : 'border-destructive/50 bg-destructive/10'
      }
    >
      <CardContent className="p-6 text-center">
        <AlertCircle
          className={`mx-auto mb-4 size-12 ${
            isWarning
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-destructive'
          }`}
        />
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{message}</p>
        <Button onClick={onBack} variant="outline">
          Volver al inicio
        </Button>
      </CardContent>
    </Card>
  );
}
