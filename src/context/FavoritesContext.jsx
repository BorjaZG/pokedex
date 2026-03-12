/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "favorites";

// --- Reducer ---
function favoritesReducer(state, action) {
  switch (action.type) {
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
  const [favorites, dispatch] = useReducer(favoritesReducer, [], loadFromStorage);

  // Persistir en localStorage cada vez que cambia el estado
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id) => dispatch({ type: "ADD", payload: id });
  const removeFavorite = (id) => dispatch({ type: "REMOVE", payload: id });
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
