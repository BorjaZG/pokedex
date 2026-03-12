import { apiFetch } from "./api";

export const moveService = {
  /** Solo el count total (para estadísticas del home) */
  getCount: () => apiFetch("/move?limit=1"),
};
