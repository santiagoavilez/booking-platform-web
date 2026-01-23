import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MessageSquare,
  Search,
  Shield,
  User,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { UserRole } from '@/shared/dtos/auth.dto';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  className?: string;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const professionalFeatures: FeatureItem[] = [
  {
    icon: <Search className="h-5 w-5 text-primary" />,
    title: 'Aumenta tu visibilidad',
    description:
      'Llega a nuevos clientes y aumenta la visibilidad de tu práctica profesional.',
  },
  {
    icon: <Calendar className="h-5 w-5 text-primary" />,
    title: 'Gestiona tu agenda',
    description:
      'Administra tu agenda y llena tus horarios disponibles sin complicaciones.',
  },
  {
    icon: <Clock className="h-5 w-5 text-primary" />,
    title: 'Optimiza tu tiempo',
    description:
      'Visualiza tu ocupación y aprovecha cada franja horaria disponible.',
  },
  {
    icon: <CreditCard className="h-5 w-5 text-primary" />,
    title: 'Cobra más rápido y seguro',
    description:
      'Recibe pagos anticipados para reducir cancelaciones de último momento.',
  },
];

const clientFeatures: FeatureItem[] = [
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: 'Encuentra profesionales',
    description:
      'Encuentra profesionales disponibles y agenda citas fácilmente.',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: 'Sin complicaciones',
    description:
      'Agenda todo más fácil y rápido. Olvídate de las llamadas interminables.',
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
    title: 'Ahorra tiempo',
    description:
      'Organiza todo desde un solo lugar: confirmaciones, pagos y recordatorios.',
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: 'Profesionales verificados',
    description:
      'Descubre los mejores profesionales con reseñas y disponibilidad en tiempo real.',
  },
];

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  features: FeatureItem[];
  onSelect: () => void;
  variant?: 'default' | 'highlighted';
}

function RoleCard({
  icon,
  title,
  subtitle,
  features,
  onSelect,
  variant = 'default',
}: RoleCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-lg',
        variant === 'highlighted' && 'ring-2 ring-primary/20'
      )}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <ul className="mb-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-3">
              <div className="mt-0.5 shrink-0">{feature.icon}</div>
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Button onClick={onSelect} className="w-full">
          Empezar
        </Button>
      </CardContent>
    </Card>
  );
}

export function RoleSelection({ onSelectRole, className }: RoleSelectionProps) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Booking Platform</h1>
        <p className="mt-2 text-muted-foreground">
          Conectamos profesionales con clientes. Elige cómo quieres usar la
          plataforma:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RoleCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          title="Soy profesional"
          subtitle="Para profesionales de la salud mental"
          features={professionalFeatures}
          onSelect={() => onSelectRole('PROFESSIONAL')}
        />

        <RoleCard
          icon={<User className="h-5 w-5 text-primary" />}
          title="Soy cliente"
          subtitle="Para personas que buscan atención"
          features={clientFeatures}
          onSelect={() => onSelectRole('CLIENT')}
          variant="highlighted"
        />
      </div>
    </div>
  );
}
