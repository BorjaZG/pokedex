import { useMemo, useState } from "react";

const COLUMNS = [
  { key: "id",      label: "#",        sortable: true  },
  { key: "name",    label: "Nombre",   sortable: true  },
  { key: "types",   label: "Tipos",    sortable: false },
  { key: "hp",      label: "HP",       sortable: true  },
  { key: "attack",  label: "Ataque",   sortable: true  },
  { key: "defense", label: "Defensa",  sortable: true  },
  { key: "speed",   label: "Vel.",     sortable: true  },
  { key: "total",   label: "Total",    sortable: true  },
];

const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon",
];

function getStat(pokemon, statName) {
  return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
}

function normalize(pokemon) {
  const hp      = getStat(pokemon, "hp");
  const attack  = getStat(pokemon, "attack");
  const defense = getStat(pokemon, "defense");
  const speed   = getStat(pokemon, "speed");
  return {
    id:      pokemon.id,
    name:    pokemon.name,
    types:   pokemon.types.map((t) => t.type.name),
    sprite:  pokemon.sprites.front_default,
    hp, attack, defense, speed,
    total:   pokemon.stats.reduce((s, st) => s + st.base_stat, 0),
  };
}

/**
 * Tabla reutilizable con ordenación y filtrado reactivo.
 * Recibe un array de objetos crudos de PokéAPI.
 */
function PokemonTable({ pokemons }) {
  const [search, setSearch]     = useState("");
  const [typeFilter, setType]   = useState("");
  const [sortKey, setSortKey]   = useState("id");
  const [sortAsc, setSortAsc]   = useState(true);

  const rows = useMemo(() => pokemons.map(normalize), [pokemons]);

  const filtered = useMemo(() => {
    return rows
      .filter((p) =>
        p.name.includes(search.toLowerCase().trim()) &&
        (typeFilter === "" || p.types.includes(typeFilter))
      )
      .sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (typeof va === "string") {
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortAsc ? va - vb : vb - va;
      });
  }, [rows, search, typeFilter, sortKey, sortAsc]);

  const handleSort = (key) => {
    if (!COLUMNS.find((c) => c.key === key)?.sortable) return;
    if (sortKey === key) setSortAsc((prev) => !prev);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return " ↕";
    return sortAsc ? " ↑" : " ↓";
  };

  return (
    <div className="pokemon-table-wrapper">
      {/* Controles de filtrado */}
      <div className="table-controls">
        <input
          type="search"
          className="table-search"
          placeholder="Buscar Pokémon…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar Pokémon"
        />
        <select
          className="table-type-filter"
          value={typeFilter}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="">Todos los tipos</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="table-count">{filtered.length} resultados</span>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <p className="table-empty">No se encontraron Pokémon con esos filtros.</p>
      ) : (
        <div className="table-scroll">
          <table className="pokemon-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={col.sortable ? "sortable" : ""}
                    aria-sort={
                      sortKey === col.key
                        ? sortAsc ? "ascending" : "descending"
                        : undefined
                    }
                  >
                    {col.label}
                    {col.sortable && (
                      <span className="sort-icon" aria-hidden="true">
                        {sortIcon(col.key)}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="td-id">#{String(p.id).padStart(3, "0")}</td>
                  <td className="td-name">
                    {p.sprite && (
                      <img src={p.sprite} alt={p.name} className="table-sprite" />
                    )}
                    {p.name}
                  </td>
                  <td className="td-types">
                    {p.types.map((t) => (
                      <span key={t} className={`type-badge type-${t}`}>{t}</span>
                    ))}
                  </td>
                  <td>{p.hp}</td>
                  <td>{p.attack}</td>
                  <td>{p.defense}</td>
                  <td>{p.speed}</td>
                  <td className="td-total"><strong>{p.total}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PokemonTable;
