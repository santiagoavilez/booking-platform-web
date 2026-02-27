# ========== Builder (shared) ==========
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm rebuild

COPY . .

# Build-time env for Vite (used in prod build)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# ========== Development ==========
FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm rebuild

COPY . .

EXPOSE 5173
CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0"]

# ========== Production (serve static with nginx) ==========
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
