import { apiFetch } from "./api";

export const typeService = {
  /** Lista completa de tipos */
  getList: () => apiFetch("/type"),

  /** Detalle de un tipo con relaciones de daño y Pokémon */
  getByName: (name) => apiFetch(`/type/${name}`),
};
