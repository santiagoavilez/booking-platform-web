import { Card, CardContent } from '@/components/ui/card';

interface ProfessionalInfoCardProps {
  professionalId: string;
  professionalName?: string;
  specialty?: string;
}

export function ProfessionalInfoCard({
  professionalId,
  professionalName,
  specialty,
}: ProfessionalInfoCardProps) {
  const displayName = professionalName || `Profesional ${professionalId.slice(0, 8)}`;
  const initials = professionalName
    ? professionalName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : professionalId.charAt(0).toUpperCase();

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4 text-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/20">
              <span className="text-2xl font-semibold text-primary">{initials}</span>
            </div>
          </div>

          {/* Professional info */}
          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            {specialty && (
              <p className="mt-1 text-sm text-muted-foreground">{specialty}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Selecciona un horario disponible
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
