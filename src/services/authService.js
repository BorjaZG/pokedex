import { supabase } from "./supabase";

export const authService = {
  /**
   * Registro con email y contraseña.
   * El rol por defecto es 'user'. Para asignar 'admin' hay que
   * hacerlo manualmente desde el panel de Supabase.
   */
  register: ({ email, password, username }) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { username, role: "user" } },
    }),

  /** Inicio de sesión con email y contraseña */
  login: ({ email, password }) =>
    supabase.auth.signInWithPassword({ email, password }),

  /** Cierre de sesión */
  logout: () => supabase.auth.signOut(),

  /** Sesión activa actual (desde localStorage) */
  getSession: () => supabase.auth.getSession(),

  /**
   * Suscripción a cambios de estado de autenticación.
   * Devuelve la función para cancelar la suscripción.
   */
  onAuthStateChange: (callback) => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return data.subscription.unsubscribe;
  },
};
