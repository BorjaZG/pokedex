/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

// --- Reducer ---
function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SESSION":
      return {
        ...state,
        user: action.payload?.user ?? null,
        session: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return { user: null, session: null, loading: false };
    default:
      return state;
  }
}

const initialState = { user: null, session: null, loading: true };

// --- Provider ---
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Recuperar sesión persistida al montar
    authService.getSession().then(({ data }) => {
      dispatch({ type: "SET_SESSION", payload: data.session });
    });

    // Escuchar cambios de sesión (login, logout, token refresh)
    const unsubscribe = authService.onAuthStateChange((session) => {
      dispatch({ type: "SET_SESSION", payload: session });
    });

    return unsubscribe;
  }, []);

  const login = async (credentials) => {
    const { error } = await authService.login(credentials);
    if (error) throw error;
  };

  const register = async (data) => {
    const { error } = await authService.register(data);
    if (error) throw error;
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  /** Rol del usuario: 'admin' | 'user' | null */
  const role = state.user?.user_metadata?.role ?? null;
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{ ...state, role, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
