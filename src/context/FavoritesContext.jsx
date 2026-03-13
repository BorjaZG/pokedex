/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";
import { favoritesService } from "../services/favoritesService";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "favorites";

// --- Reducer ---
function favoritesReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      if (state.includes(action.payload)) return state;
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// --- Provider ---
export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  // Cuando la auth resuelve, cargamos de la fuente correcta
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      favoritesService
        .getAll()
        .then((ids) => dispatch({ type: "SET", payload: ids }))
        .catch(() => dispatch({ type: "SET", payload: [] }));
    } else {
      dispatch({ type: "SET", payload: loadFromStorage() });
    }
  }, [user, authLoading]);

  // Persistir en localStorage solo cuando no hay sesión activa
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addFavorite = async (id) => {
    dispatch({ type: "ADD", payload: id });
    if (user) {
      try { await favoritesService.add(id); }
      catch { dispatch({ type: "REMOVE", payload: id }); } // revert on error
    }
  };

  const removeFavorite = async (id) => {
    dispatch({ type: "REMOVE", payload: id });
    if (user) {
      try { await favoritesService.remove(id); }
      catch { dispatch({ type: "ADD", payload: id }); } // revert on error
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
