import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../hooks/useAsync';

describe('useAsync', () => {
  it('empieza en estado loading', () => {
    const { result } = renderHook(() =>
      useAsync(() => new Promise(() => {}), [])
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('devuelve los datos cuando la promesa resuelve', async () => {
    const mockData = [{ id: 1, name: 'bulbasaur' }];
    const { result } = renderHook(() =>
      useAsync(() => Promise.resolve(mockData), [])
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('captura el error cuando la promesa rechaza', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() =>
      useAsync(() => Promise.reject(new Error('Error de red')), [])
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Error de red');
    expect(result.current.data).toBeNull();
    consoleSpy.mockRestore();
  });

  it('vuelve a ejecutarse cuando cambian las dependencias', async () => {
    const fn = vi.fn().mockResolvedValue('respuesta');
    const { rerender } = renderHook(
      ({ dep }) => useAsync(() => fn(), [dep]),
      { initialProps: { dep: 1 } }
    );

    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));

    rerender({ dep: 2 });
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });
});
