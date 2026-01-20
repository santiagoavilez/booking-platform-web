# Booking Platform Web

Frontend para la plataforma de reserva de citas, desarrollado con React + Vite.

## Descripción

Interfaz de usuario para la plataforma de reservas que permite a usuarios y profesionales gestionar citas, disponibilidades y notificaciones.

## Stack Tecnológico

- **Framework**: React 18
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm

## Instalación

```bash
pnpm install
```

## Scripts

```bash
# Desarrollo
pnpm run dev

# Build para producción
pnpm run build

# Preview del build
pnpm run preview

# Linting
pnpm run lint
```

## Desarrollo

El proyecto usa Vite para desarrollo rápido con Hot Module Replacement (HMR).

## Configuración

### Tailwind CSS

El proyecto está configurado con Tailwind CSS v4 usando el plugin `@tailwindcss/vite`. La configuración se encuentra en `tailwind.config.js` y los estilos base en `src/index.css`.

### shadcn/ui

Los componentes de shadcn/ui están configurados y listos para usar. Para agregar nuevos componentes:

```bash
pnpm dlx shadcn@latest add [component-name]
```

La configuración de shadcn/ui se encuentra en `components.json`.

### Path Aliases

El proyecto usa alias de rutas configurados:
- `@/` apunta a `./src/`

Ejemplo de uso:
```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Estructura del Proyecto

```
src/
  ├── components/
  │   └── ui/          # Componentes de shadcn/ui
  ├── lib/
  │   └── utils.ts     # Utilidades (cn function)
  ├── App.tsx
  ├── main.tsx
  └── index.css        # Estilos globales y variables CSS
```

## Tipos Compartidos

Los enums y tipos compartidos con el backend están en `src/types/enums.ts`. Estos deben mantenerse sincronizados manualmente con el backend cuando cambien.
