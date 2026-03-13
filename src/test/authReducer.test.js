import { describe, it, expect } from 'vitest';

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SESSION':
      return {
        ...state,
        user: action.payload?.user ?? null,
        session: action.payload,
        loading: false,
      };
    case 'LOGOUT':
      return { user: null, session: null, loading: false };
    default:
      return state;
  }
}

const initialState = { user: null, session: null, loading: true };

describe('authReducer', () => {
  it('SET_LOADING actualiza el flag de carga', () => {
    const result = authReducer(initialState, { type: 'SET_LOADING', payload: false });
    expect(result.loading).toBe(false);
  });

  it('SET_SESSION guarda usuario y sesión, y desactiva loading', () => {
    const session = { user: { id: '123', email: 'ash@pokemon.com' } };
    const result = authReducer(initialState, { type: 'SET_SESSION', payload: session });
    expect(result.user).toEqual(session.user);
    expect(result.session).toEqual(session);
    expect(result.loading).toBe(false);
  });

  it('SET_SESSION con null limpia el usuario', () => {
    const state = { user: { id: '123' }, session: {}, loading: false };
    const result = authReducer(state, { type: 'SET_SESSION', payload: null });
    expect(result.user).toBeNull();
    expect(result.session).toBeNull();
  });

  it('LOGOUT limpia usuario, sesión y carga', () => {
    const state = { user: { id: '123' }, session: {}, loading: false };
    const result = authReducer(state, { type: 'LOGOUT' });
    expect(result).toEqual({ user: null, session: null, loading: false });
  });

  it('acción desconocida devuelve el estado sin cambios', () => {
    const result = authReducer(initialState, { type: 'UNKNOWN' });
    expect(result).toBe(initialState);
  });
});
