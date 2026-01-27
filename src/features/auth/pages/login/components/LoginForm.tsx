import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLogin } from '@/features/auth/hooks';

// Validation schema with Spanish messages
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  // Extract error message from API response
  const getErrorMessage = () => {
    if (!error) return null;

    if (error instanceof AxiosError) {
      const message = error.response?.data?.message;
      if (message) return message;

      if (error.response?.status === 401) {
        return 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      }

      if (error.response?.status === 404) {
        return 'Usuario no encontrado. ¿Ya tienes una cuenta?';
      }
    }

    return 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                  <p className="text-muted-foreground text-balance">
                    Inicia sesión en tu cuenta
                  </p>
                </div>

                {errorMessage && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Contraseña</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    to="/signup"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Regístrate
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
