import { useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const logout = useLogout();

    if (!user) {
        return null;
    }

    const isProfessional = user.role === 'PROFESSIONAL';

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="min-h-svh bg-linear-to-br from-background via-background to-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
                    <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                        Booking Platform
                    </h1>
                    <Button variant="outline" size="sm" onClick={logout}>
                        Cerrar sesión
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
                <div className="space-y-8">
                    {/* Welcome section */}
                    <section className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            Bienvenido de nuevo
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {user.firstName} {user.lastName}
                        </h2>
                    </section>

                    {/* Profile card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tu perfil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                {/* Avatar */}
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                    {initials}
                                </div>

                                {/* User info */}
                                <div className="space-y-4 flex-1">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Nombre
                                            </p>
                                            <p className="font-medium">{user.firstName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Apellido
                                            </p>
                                            <p className="font-medium">{user.lastName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Correo electrónico
                                        </p>
                                        <p className="font-medium text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick actions */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Acciones rápidas</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Availability - Only for professionals */}
                            {isProfessional && (
                                <Card
                                    className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                                    onClick={() => navigate('/availability')}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <svg
                                                className="h-6 w-6 text-primary"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="font-medium">Mi disponibilidad</p>
                                        <p className="text-xs text-muted-foreground">Configura tus horarios</p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="cursor-not-allowed opacity-60">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <svg
                                            className="h-6 w-6 text-muted-foreground"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="font-medium">Mis citas próximamente</p>
                                    <p className="text-xs text-muted-foreground">Próximamente</p>
                                </CardContent>
                            </Card>

                            {/* Professionals - Only for clients */}
                            {!isProfessional && (
                                <Card className="cursor-not-allowed opacity-60"
                                    onClick={() => navigate('/professionals')}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <svg
                                                className="h-6 w-6 text-muted-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="font-medium">Buscar profesionales</p>
                                        <p className="text-xs text-muted-foreground">Próximamente</p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="cursor-not-allowed opacity-60">
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <svg
                                            className="h-6 w-6 text-muted-foreground"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="font-medium">Configuración</p>
                                    <p className="text-xs text-muted-foreground">Próximamente</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

