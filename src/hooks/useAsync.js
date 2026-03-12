import { useEffect, useReducer } from "react";

function asyncReducer(state, action) {
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

/**
 * Ejecuta una función asíncrona (como un servicio) y gestiona
 * los estados loading, error y data.
 *
 * @param {() => Promise<any>} asyncFn  Función que devuelve una Promise
 * @param {any[]} deps  Dependencias del useEffect (como en useMemo)
 */
export function useAsync(asyncFn, deps = []) {
  const [state, dispatch] = useReducer(asyncReducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "loading" });

    asyncFn()
      .then((result) => {
        if (!cancelled) dispatch({ type: "success", payload: result });
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: "error", payload: err.message || "Error desconocido" });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
