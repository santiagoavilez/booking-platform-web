import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ArrowLeft, Briefcase, Loader2, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRegister } from '@/features/auth/hooks';
import type { UserRole } from '@/shared/dtos/auth.dto';

// Validation schema with Spanish messages
const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(1, 'El apellido es obligatorio')
      .min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z
      .email('El correo electrónico no es válido')
      .min(1, 'El correo electrónico es obligatorio'),

    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps extends React.ComponentProps<'div'> {
  role: UserRole;
  onBack: () => void;
}

const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode }> = {
  PROFESSIONAL: {
    label: 'Profesional',
    icon: <Briefcase className="h-4 w-4" />,
  },
  CLIENT: {
    label: 'Cliente',
    icon: <User className="h-4 w-4" />,
  },
  ADMIN: {
    label: 'Administrador',
    icon: <User className="h-4 w-4" />,
  },
};

export function SignupForm({ className, role, onBack, ...props }: SignupFormProps) {
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: role,
    });
  };

  // Extract error message from API response
  const getErrorMessage = () => {
    if (!error) return null;

    if (error instanceof AxiosError) {
      const message = error.response?.data?.message;
      if (message) return message;

      if (error.response?.status === 409) {
        return 'Este correo ya está registrado. ¿Ya tienes una cuenta?';
      }

      if (error.response?.status === 400) {
        return 'Datos inválidos. Verifica la información ingresada.';
      }
    }

    return 'Ocurrió un error al crear la cuenta. Intenta de nuevo.';
  };

  const errorMessage = getErrorMessage();
  const roleInfo = roleLabels[role];

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="link"
                    onClick={onBack}
                    className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                      {roleInfo.icon}
                      <span>{roleInfo.label}</span>
                    </div>
                    <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Ingresa tu correo electrónico abajo para crear tu cuenta
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Juan"
                            autoComplete="given-name"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Pérez"
                            autoComplete="family-name"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ejemplo@correo.com"
                          autoComplete="email"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Usaremos este correo para contactarte.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Debe tener al menos 8 caracteres.
                </p>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </Form>
          <div className="relative hidden md:block overflow-hidden">
            {/* Galaxy accent panel */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-purple-600/10 to-blue-600/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,112,219,0.3)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(100,150,230,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-xl font-bold text-white/90 mb-2">Booking Platform</h2>
                <p className="text-sm text-white/60">Tu portal de citas profesionales</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="px-6 text-center text-sm text-muted-foreground">
        Al continuar, aceptas nuestros <a href="#">Términos de servicio</a> y{' '}
        <a href="#">Política de privacidad</a>.
      </p>
    </div>
  );
}
