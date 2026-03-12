import { useEffect, useReducer } from "react";

function fetchReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.payload, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function useFetch(url) {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    let cancel = false;

    dispatch({ type: "loading" });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los datos");
        return res.json();
      })
      .then((json) => {
        if (!cancel) dispatch({ type: "success", payload: json });
      })
      .catch((err) => {
        if (!cancel)
          dispatch({ type: "error", payload: err.message || "Error desconocido" });
      });

    return () => {
      cancel = true;
    };
  }, [url]);

  return state;
}
