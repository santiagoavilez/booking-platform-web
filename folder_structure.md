booking-web/
├── src/
│   ├── app/                         # Setup global
│   │   ├── providers/
│   │   │   ├── react-query.provider.tsx
│   │   │   ├── auth.provider.tsx
│   │   │   └── theme.provider.tsx
│   │   │
│   │   ├── router.tsx
│   │   └── guards/
│   │       └── auth.guard.tsx
│   │
│   ├── features/                    # 🧩 Feature-based
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   └── pages/
│   │   │
│   │   ├── professionals/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   └── pages/
│   │   │
│   │   ├── availability/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   └── components/
│   │   │
│   │   └── appointments/
│   │       ├── api.ts
│   │       ├── hooks.ts
│   │       └── pages/
│   │
│   ├── components/                  # UI reutilizable
│   │   ├── ui/                      # shadcn
│   │   └── layout/
│   │
│   ├── services/
│   │   └── api-client.ts            # Axios / fetch wrapper
│   │
│   ├── shared/                      # Tipos locales
│   │   ├── enums/
│   │   ├── dtos/
│   │   └── constants/
│   │   
│   │
│   ├── index.css
│   ├── main.tsx
│   └── App.tsx
│
├── public/
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── package.json
└── README.md
