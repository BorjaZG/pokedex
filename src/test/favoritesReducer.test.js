import { describe, it, expect } from 'vitest';

// Extraemos el reducer directamente (misma lógica que en FavoritesContext)
function favoritesReducer(state, action) {
  switch (action.type) {
    case 'SET':    return action.payload;
    case 'ADD':    return state.includes(action.payload) ? state : [...state, action.payload];
    case 'REMOVE': return state.filter((id) => id !== action.payload);
    default:       return state;
  }
}

describe('favoritesReducer', () => {
  it('SET reemplaza el estado completo', () => {
    const result = favoritesReducer([1, 2], { type: 'SET', payload: [10, 20] });
    expect(result).toEqual([10, 20]);
  });

  it('ADD añade un id nuevo', () => {
    const result = favoritesReducer([1], { type: 'ADD', payload: 2 });
    expect(result).toEqual([1, 2]);
  });

  it('ADD no añade duplicados', () => {
    const result = favoritesReducer([1, 2], { type: 'ADD', payload: 2 });
    expect(result).toEqual([1, 2]);
  });

  it('REMOVE elimina el id indicado', () => {
    const result = favoritesReducer([1, 2, 3], { type: 'REMOVE', payload: 2 });
    expect(result).toEqual([1, 3]);
  });

  it('REMOVE no falla si el id no existe', () => {
    const result = favoritesReducer([1, 3], { type: 'REMOVE', payload: 99 });
    expect(result).toEqual([1, 3]);
  });

  it('acción desconocida devuelve el estado sin cambios', () => {
    const state = [1, 2];
    const result = favoritesReducer(state, { type: 'UNKNOWN' });
    expect(result).toBe(state);
  });
});
