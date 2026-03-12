# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

No test framework is configured.

## Architecture

React 19 SPA using React Router 7, plain JavaScript/JSX, Vite, and CSS variables for theming. Fetches data from [PokéAPI](https://pokeapi.co/api/v2/) — scoped to Gen-1 Pokémon (IDs 1–151).

### Routing (`src/App.jsx`)

```
/ → HomePage
/pokemon → PokemonListPage
/pokemon/:id → PokemonDetailPage
/types → TypeListPage
/types/:name → TypeDetailPage
* → NotFoundPage
```

Header and Footer wrap all routes.

### Data layer

- `src/hooks/useFetch.js` — generic fetch hook with loading/error/data states and request cancellation; used by all pages.
- Pages own all data fetching; components are purely presentational.
- No global state library — component `useState` + `useMemo` for filtering/sorting.

### Theming

- `src/hooks/useTheme.js` — persists light/dark choice to localStorage, sets `data-theme` on `<html>`.
- All styles in `src/styles/globals.css` (single file, ~988 lines) using CSS variables: `:root` for light, `:root[data-theme="dark"]` for dark overrides.

### Key conventions

- UI language is Spanish (comments and user-facing strings).
- `OakDialog` is a recurring thematic component styled as Professor Oak's dialog box — use it for instructional or introductory text in pages.
- Pokémon sprites are fetched from the PokeAPI GitHub sprite repo; official artwork uses the `other['official-artwork']` field from the API response.
