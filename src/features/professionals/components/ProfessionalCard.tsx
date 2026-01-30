import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ProfessionalDTO } from '@/shared/dtos/professional.dto';

function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  return (first + last).toUpperCase().slice(0, 2) || '?';
}

function getDisplayName(professional: ProfessionalDTO): string {
  if (professional.fullName?.trim()) return professional.fullName.trim();
  return [professional.firstName, professional.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Profesional';
}

/**
 * Card displaying a professional with avatar, name, optional email and CTA to book
 */
export function ProfessionalCard({ professional }: { professional: ProfessionalDTO }) {
  const initials = getInitials(professional.firstName, professional.lastName);
  const displayName = getDisplayName(professional);

  return (
    <Card className="flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col items-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <span className="text-lg font-semibold text-primary">{initials}</span>
        </div>
        <h2 className="font-medium">{displayName}</h2>
        {professional.email && (
          <p className="mt-1 text-sm text-muted-foreground">{professional.email}</p>
        )}
        <Button
          asChild
          className="mt-4 min-h-[44px] min-w-[44px] px-4 py-3"
          variant="default"
        >
          <Link to={`/professional/${professional.id}`}>Reservar cita</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
