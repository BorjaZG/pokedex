import { supabase } from "./supabase";

export const favoritesService = {
  /** Obtiene los pokemon_id favoritos del usuario autenticado */
  getAll: async () => {
    const { data, error } = await supabase
      .from("favorites")
      .select("pokemon_id");
    if (error) throw error;
    return data.map((f) => f.pokemon_id);
  },

  /** Añade un favorito para el usuario autenticado */
  add: async (pokemonId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("favorites")
      .insert({ pokemon_id: pokemonId, user_id: session.user.id });
    if (error) throw error;
  },

  /** Elimina un favorito del usuario autenticado */
  remove: async (pokemonId) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("pokemon_id", pokemonId);
    if (error) throw error;
  },
};
