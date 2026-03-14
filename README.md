# PokéDex Explorer

Aplicación web SPA construida con React 19 que permite explorar los 151 Pokémon de la Generación I. Incluye autenticación por roles, favoritos por usuario sincronizados en la nube, dashboard interactivo y subida de avatar con recorte.

---

## Tech stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 7 |
| Routing | React Router 7 |
| Auth + BD | Supabase (JWT, RLS, user metadata) |
| Imágenes | Cloudinary (subida sin firma desde el navegador) |
| Estilos | CSS vanilla con variables (`globals.css`) |
| Tests | Vitest + React Testing Library |
| Despliegue local | Docker + nginx |
| Despliegue cloud | Vercel |
| Datos | PokéAPI (Gen-I, IDs 1–151) |

---

## Funcionalidades

### Obligatorias
- **Autenticación JWT** — Registro, login y persistencia de sesión vía Supabase Auth. Protección de rutas con `ProtectedRoute`. Control de acceso basado en roles (`user` / `admin`).
- **Estado global** — `AuthContext`, `FavoritesContext` y `ThemeContext` con `useReducer`. Sin librerías de estado externas.
- **Capa de servicios** — `pokemonService`, `favoritesService`, `authService`, `cloudinaryService`, `typeService`, `moveService`. Ningún componente hace `fetch` directo.
- **Dashboard** — Vista diferenciada por rol. Admin: tabla completa con estadísticas de los 151 Pokémon. Usuario: tabla de sus favoritos con resumen. Ambas con búsqueda, filtro por tipo y ordenación reactiva.
- **Testing unitario** — 20 tests en 4 ficheros (reducers, hook `useAsync`, componente `PokemonTable`).

### Extra
- **Control de versiones** — Flujo de ramas por funcionalidad (`feat/*`), commits semánticos.
- **Servicio externo** — Cloudinary: subida directa de avatar con recorte interactivo circular (zoom + arrastre) usando `react-easy-crop` y Canvas API. URL guardada en `user_metadata` de Supabase.
- **Despliegue** — Docker multi-etapa (Node build + nginx serve) para local. Vercel para cloud.

---

## Variables de entorno

Crea un fichero `.env` en la raíz (ver `.env.example`):

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
```

> Las variables `VITE_*` se incrustan en el bundle en tiempo de compilación.

---

## Arranque en local

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # build de producción en /dist
npm run preview      # sirve el build en http://localhost:4173
```

---

## Tests

```bash
npm run test                # modo watch
npm run test:coverage       # informe de cobertura en /coverage
```

Los tests cubren:
- `authReducer` — transiciones SET_SESSION, LOGOUT, SET_LOADING
- `favoritesReducer` — ADD, REMOVE, SET, deduplicación
- `useAsync` — estados loading/data/error y re-ejecución por dependencias
- `PokemonTable` — render, filtro por nombre, filtro por tipo, estado vacío, ordenación

---

## Despliegue local con Docker

```bash
docker compose up --build
# La app queda disponible en http://localhost:8080
```

Las variables de entorno se pasan como `build-arg` desde el fichero `.env` a través de `docker-compose.yml`.

---

## Despliegue en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Añadir las 4 variables de entorno en **Settings → Environment Variables**
3. El fichero `vercel.json` ya configura el rewrite necesario para el routing de la SPA

---

## Arquitectura

```
src/
├── context/          # Estado global (Auth, Favorites, Theme)
├── services/         # Acceso a APIs (Supabase, Cloudinary, PokéAPI)
├── hooks/            # useAsync (fetch genérico), useTheme
├── components/
│   └── dashboard/    # StatCard, PokemonTable
├── pages/
│   └── dashboard/    # AdminDashboard, UserDashboard
├── utils/            # cropImage (canvas)
├── styles/           # globals.css (tema claro/oscuro)
└── test/             # Vitest + RTL
```

**Flujo de datos:** las páginas consumen hooks/contextos → los contextos llaman a servicios → los servicios usan el cliente de Supabase o `fetch` a PokéAPI. Ningún componente hace peticiones directamente.

**Temas:** `ThemeContext` persiste la elección en `localStorage` y aplica `data-theme="dark"` en `<html>`. Todos los colores son variables CSS.

**Roles:** el rol se almacena en `user_metadata.role` del token JWT de Supabase. Para promover un usuario a admin:

```sql
update auth.users
set raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
where email = 'usuario@ejemplo.com';
```

---

## Decisiones técnicas

| Decisión | Motivo |
|---|---|
| Supabase en lugar de backend propio | La asignatura es de interfaces; Supabase proporciona JWT real sin gestionar servidor |
| Cloudinary con preset sin firma | Permite subida directa desde el navegador sin exponer credenciales secretas |
| CSS vanilla sin framework | Control total del tema y sin sobrecarga de dependencias |
| `useReducer` en contextos | Transiciones de estado predecibles y fácilmente testables |
| Vitest en lugar de Jest | Integración nativa con Vite, sin configuración adicional |
