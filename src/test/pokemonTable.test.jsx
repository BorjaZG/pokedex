import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonTable from '../components/dashboard/PokemonTable';

// Datos mínimos con la estructura que devuelve PokéAPI
function makePokemon(id, name, types, stats) {
  return {
    id,
    name,
    types: types.map((t) => ({ type: { name: t } })),
    sprites: { front_default: null },
    stats: [
      { stat: { name: 'hp' },      base_stat: stats[0] },
      { stat: { name: 'attack' },  base_stat: stats[1] },
      { stat: { name: 'defense' }, base_stat: stats[2] },
      { stat: { name: 'speed' },   base_stat: stats[3] },
    ],
  };
}

const pokemons = [
  makePokemon(1,  'bulbasaur',  ['grass', 'poison'], [45, 49, 49, 45]),
  makePokemon(4,  'charmander', ['fire'],             [39, 52, 43, 65]),
  makePokemon(7,  'squirtle',   ['water'],            [44, 48, 65, 43]),
  makePokemon(25, 'pikachu',    ['electric'],         [35, 55, 40, 90]),
];

describe('PokemonTable', () => {
  it('renderiza todos los Pokémon recibidos', () => {
    render(<PokemonTable pokemons={pokemons} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.getByText('squirtle')).toBeInTheDocument();
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('filtra por nombre al escribir en el buscador', async () => {
    render(<PokemonTable pokemons={pokemons} />);
    const input = screen.getByPlaceholderText('Buscar Pokémon…');

    await userEvent.type(input, 'char');

    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
  });

  it('filtra por tipo al seleccionar el desplegable', async () => {
    render(<PokemonTable pokemons={pokemons} />);
    const select = screen.getByLabelText('Filtrar por tipo');

    await userEvent.selectOptions(select, 'water');

    expect(screen.getByText('squirtle')).toBeInTheDocument();
    expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
  });

  it('muestra mensaje de vacío cuando no hay resultados', async () => {
    render(<PokemonTable pokemons={pokemons} />);
    const input = screen.getByPlaceholderText('Buscar Pokémon…');

    await userEvent.type(input, 'mewtwo');

    expect(screen.getByText(/no se encontraron/i)).toBeInTheDocument();
  });

  it('ordena por velocidad al hacer clic en la cabecera', async () => {
    render(<PokemonTable pokemons={pokemons} />);

    // Clic en cabecera "Vel." → orden ascendente
    await userEvent.click(screen.getByText('Vel.'));

    const rows = screen.getAllByRole('row').slice(1); // quitar cabecera
    const speeds = rows.map((r) => Number(r.cells[6].textContent));
    expect(speeds).toEqual([...speeds].sort((a, b) => a - b));
  });
});
