import { Link } from "react-router-dom";
import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { pokemonService } from "../services/pokemonService";
import { typeService } from "../services/typeService";
import { moveService } from "../services/moveService";
import OakDialog from "../components/OakDialog";

function HomePage() {
  // IDs entre 1 y 151 para mantener coherencia con la app
  const [featuredId] = useState(() => Math.floor(Math.random() * 151) + 1);

    const { data: pokemonCountData } = useAsync(() => pokemonService.getCount(), []);
    const { data: typeData } = useAsync(() => typeService.getList(), []);
    const { data: moveCountData } = useAsync(() => moveService.getCount(), []);
    const { data: featuredPokemon } = useAsync(
        () => pokemonService.getById(featuredId),
        [featuredId]
    );

    const totalPokemon = pokemonCountData?.count ?? "—";
    const totalTypes = typeData
        ? typeData.results.filter(
            (t) => t.name !== "shadow" && t.name !== "unknown"
        ).length
        : "—";
    const totalMoves = moveCountData?.count ?? "—";

    const featuredSprite =
        featuredPokemon?.sprites?.other?.["official-artwork"]?.front_default ||
        featuredPokemon?.sprites?.front_default;

    return (
        <section className="page home">
        {/* Bloque principal de presentación */}
        <header className="home-hero">
            <div>
            <h1>PokéDex Explorer</h1>
            <p>
                Aplicación web en React para explorar Pokémon de la primera
                generación y sus tipos usando la PokéAPI.
            </p>
            </div>

            <div className="home-links">
            <Link to="/pokemon" className="btn">
                Ver lista de Pokémon
            </Link>
            <Link to="/types" className="btn secondary">
                Ver tipos
            </Link>
            </div>
        </header>

        {/* Profesor Oak dando la bienvenida */}
        <OakDialog>
            <p>
                <strong>¡Hola, entrenador!</strong>
            </p>
            <p>
                Bienvenido a <strong>PokéDex Explorer</strong>. Mi nombre es{" "}
                <strong>Oak</strong>, profesor Pokémon.
            </p>
            <p>
                Desde aquí podrás consultar Pokémon, aprender sobre sus tipos y
                practicar el desarrollo de interfaces mientras exploras la PokéAPI.
            </p>
            <p>
                ¡Cuando estés listo, usa los botones de arriba para empezar tu
                aventura!
            </p>
        </OakDialog>

        {/* Resumen de datos curiosos */}
        <section className="home-stats">
            <article className="home-stat-card">
            <h2>Pokémon registrados</h2>
            <p className="home-stat-number">{totalPokemon}</p>
            <p className="home-stat-label">
                Número total de especies en la PokéAPI.
            </p>
            </article>

            <article className="home-stat-card">
            <h2>Tipos diferentes</h2>
            <p className="home-stat-number">{totalTypes}</p>
            <p className="home-stat-label">
                Tipos elementales disponibles (fuego, agua, planta…).
            </p>
            </article>

            <article className="home-stat-card">
            <h2>Movimientos</h2>
            <p className="home-stat-number">{totalMoves}</p>
            <p className="home-stat-label">
                Movimientos posibles registrados en la PokéAPI.
            </p>
            </article>
        </section>

        {/* Pokémon destacado */}
        <section className="home-featured">
            <h2>Pokémon destacado</h2>
            {featuredPokemon ? (
            <Link
                to={`/pokemon/${featuredPokemon.id}`}
                className="home-featured-card-link"
            >
                <article className="home-featured-card">
                <div className="home-featured-image">
                    {featuredSprite && (
                    <img src={featuredSprite} alt={featuredPokemon.name} />
                    )}
                </div>
                <div className="home-featured-info">
                    <h3>
                    #{String(featuredPokemon.id).padStart(3, "0")}{" "}
                    {featuredPokemon.name}
                    </h3>
                    <p className="home-featured-types">
                    {featuredPokemon.types
                        .map((t) => t.type.name)
                        .join(" / ")}
                    </p>
                    <p className="home-featured-note">
                    Haz clic para ver la carta completa de este Pokémon.
                    </p>
                </div>
                </article>
            </Link>
            ) : (
            <p className="home-featured-loading">
                Cargando Pokémon destacado...
            </p>
            )}
        </section>
        </section>
    );
}

export default HomePage;