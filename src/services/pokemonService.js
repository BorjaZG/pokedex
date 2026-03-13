import { apiFetch } from "./api";

export const pokemonService = {
  /** Lista de los 151 Pokémon de Gen-1 */
  getList: () => apiFetch("/pokemon?limit=151"),

  /** Pokémon individual por ID o nombre */
  getById: (id) => apiFetch(`/pokemon/${id}`),

  /** Solo el count total (para estadísticas del home) */
  getCount: () => apiFetch("/pokemon?limit=1"),

  /** Todos los 151 de Gen-1 con sus detalles completos (para el dashboard) */
  getAllDetails: async () => {
    const ids = Array.from({ length: 151 }, (_, i) => i + 1);
    return Promise.all(ids.map((id) => apiFetch(`/pokemon/${id}`)));
  },
};
