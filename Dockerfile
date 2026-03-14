# ── Etapa 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (capa cacheada)
COPY package*.json ./
RUN npm ci

# Variables de entorno de Vite (se inyectan en tiempo de build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

COPY . .
RUN npm run build

# ── Etapa 2: serve ────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build generado
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
