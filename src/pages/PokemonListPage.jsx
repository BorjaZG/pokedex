import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { pokemonService } from "../services/pokemonService";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OakDialog from "../components/OakDialog";
import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import CardGrid from "../components/CardGrid";

function getIdFromUrl(url) {
    const parts = url.split("/").filter(Boolean);
    return Number(parts[parts.length - 1]);
}

function PokemonListPage() {
    const { data, loading, error } = useAsync(() => pokemonService.getList(), []);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("id-asc");
    const [maxId, setMaxId] = useState(151);

    const pokemonWithId = useMemo(() => {
        if (!data) return [];
        return data.results.map((p) => ({
        ...p,
        id: getIdFromUrl(p.url),
        }));
    }, [data]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return pokemonWithId
        .filter((p) => p.id <= maxId)
        .filter((p) => p.name.toLowerCase().includes(query))
        .sort((a, b) => {
            switch (sort) {
            case "id-desc":
                return b.id - a.id;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "id-asc":
            default:
                return a.id - b.id;
            }
        });
    }, [pokemonWithId, search, sort, maxId]);

    const trimmedSearch = search.trim();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <section className="page">
        <div className="page-header">
            <h1>Pokémon</h1>
            <p>Mostrando los Pokémon de la primera generación (1–151).</p>
        </div>

        {/* Caja de diálogo reutilizable de Oak */}
        <OakDialog>
            <p>
            Aquí encontrarás todos los Pokémon de la <strong>1ª generación</strong>.
            </p>
            <p>
            Usa la barra de búsqueda, la ordenación y el deslizador para filtrar la lista.
            Haz clic en cualquier carta para ver su información completa.
            </p>
        </OakDialog>

        {/* Controles de filtro y búsqueda */}
        <div className="filters">
            <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre..."
            />

            <SortSelect value={sort} onChange={setSort} />

            <div className="filter-range">
            <span>Máx. número:</span>
            <input
                type="range"
                min="1"
                max="151"
                value={maxId}
                onChange={(e) => setMaxId(Number(e.target.value))}
            />
            <span>{maxId}</span>
            </div>

            <button
            type="button"
            className="btn secondary"
            onClick={() => {
                setSearch("");
                setSort("id-asc");
                setMaxId(151);
            }}
            >
            Limpiar
            </button>
        </div>

        <p className="results-info">
            Mostrando <strong>{filtered.length}</strong> Pokémon
            {trimmedSearch ? (
            <>
                {" "}
                para "<strong>{trimmedSearch}</strong>"
            </>
            ) : null}
        </p>

        {/* Mensaje cuando la lista queda vacía */}
        {filtered.length === 0 ? (
            <p className="empty-message">
            No se encontraron Pokémon con esos filtros. Prueba a cambiar la búsqueda
            o aumentar el número máximo.
            </p>
        ) : (
            <CardGrid>
            {filtered.map((pokemon) => {
                const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

                return (
                <Link
                    key={pokemon.name}
                    to={`/pokemon/${pokemon.id}`}
                    className="card pokemon-card"
                >
                    <img src={spriteUrl} alt={pokemon.name} />
                    <h3>{pokemon.name}</h3>
                    <p>#{String(pokemon.id).padStart(3, "0")}</p>
                </Link>
                );
            })}
            </CardGrid>
        )}
        </section>
    );
}

export default PokemonListPage;