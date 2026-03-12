const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Cliente base para la PokéAPI.
 * Todas las peticiones pasan por aquí para centralizar
 * la URL base y el manejo de errores HTTP.
 */
export async function apiFetch(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se pudo cargar ${endpoint}`);
  }
  return res.json();
}
