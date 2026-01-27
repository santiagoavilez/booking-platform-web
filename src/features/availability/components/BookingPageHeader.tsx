import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingPageHeaderProps {
  title: string;
  onBack: () => void;
}

export function BookingPageHeader({ title, onBack }: BookingPageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 md:px-6 md:py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="size-9 shrink-0"
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">Volver</span>
        </Button>
        <h1 className="text-base font-semibold tracking-tight md:text-lg">{title}</h1>
      </div>
    </header>
  );
}
