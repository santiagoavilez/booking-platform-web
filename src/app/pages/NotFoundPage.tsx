import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="relative min-h-svh overflow-hidden">

            {/* Content */}
            <div className="relative flex min-h-svh flex-col items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8 text-center">
                    {/* 404 number with glitch effect */}
                    <div className="relative select-none">
                        <span
                            className="block text-[10rem] font-black leading-none tracking-tighter text-foreground/5 md:text-[14rem]"
                            aria-hidden="true"
                        >
                            404
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center text-7xl font-black tracking-tight md:text-8xl">
                            <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                                Oops
                            </span>
                        </span>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <h1 className="text-xl font-medium text-foreground md:text-2xl">
                            Página no encontrada
                        </h1>
                        <p className="mx-auto max-w-sm text-sm text-muted-foreground md:text-base">
                            Lo sentimos, la página que buscas no existe o fue movida a otra ubicación.
                        </p>
                    </div>

                    {/* Action */}
                    <div className="pt-4">
                        <Button asChild size="lg">
                            <Link to="/">
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Volver al inicio
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <p className="absolute bottom-8 text-xs text-muted-foreground/60">
                    Error 404
                </p>
            </div>
        </div>
    );
}

