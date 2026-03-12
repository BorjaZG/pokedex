import { useParams, Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { typeService } from "../services/typeService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OakDialog from "../components/OakDialog";

const TYPE_COLORS = {
    normal: "#a8a77a",
    fire: "#ee8130",
    water: "#6390f0",
    electric: "#f7d02c",
    grass: "#7ac74c",
    ice: "#96d9d6",
    fighting: "#c22e28",
    poison: "#a33ea1",
    ground: "#e2bf65",
    flying: "#a98ff3",
    psychic: "#f95587",
    bug: "#a6b91a",
    rock: "#b6a136",
    ghost: "#735797",
    dragon: "#6f35fc",
    dark: "#705746",
    steel: "#b7b7ce",
    fairy: "#d685ad",
    stellar: "#38bdf8",
};

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function renderTypeTags(list) {
    if (!list || list.length === 0) {
        return <span className="relation-tag relation-tag-empty">Ninguno</span>;
    }

    return list.map((t) => (
        <span key={t.name} className="relation-tag">
        {t.name}
        </span>
    ));
}

function TypeDetailPage() {
    const { name } = useParams(); // /types/:name
    const { data, loading, error } = useAsync(() => typeService.getByName(name), [name]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!data) return null;

    const niceName = capitalize(data.name);
    const { damage_relations, pokemon } = data;

    // Pokémons de ejemplo (primeros 8)
    const samplePokemon = pokemon.slice(0, 8).map((p) => {
        const parts = p.pokemon.url.split("/").filter(Boolean);
        const id = Number(parts[parts.length - 1]);

        return {
        name: p.pokemon.name,
        id,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
    });

    const mainColor = TYPE_COLORS[data.name] || "#e5e7eb";

    return (
        <section className="page type-detail-page">
        <Link to="/types" className="back-link">
            ← Volver a la lista de tipos
        </Link>

        {/* Oak explicando el tipo */}
        <OakDialog>
            <p>
            Estás consultando el tipo <strong>{niceName}</strong>.
            </p>
            <p>
            Cada tipo tiene fortalezas y debilidades frente a otros. Más abajo
            puedes ver cómo se comporta <strong>{niceName}</strong> en combate y
            algunos Pokémon representativos.
            </p>
        </OakDialog>

        {/* Layout principal */}
        <div className="type-detail-layout">
            {/* Tarjeta resumen del tipo */}
            <article className="type-overview-card">
            <header
                className="type-overview-header"
                style={{ background: mainColor }}
            >
                <span className="type-pill-big">{niceName}</span>
                <span className="type-count">
                {pokemon.length} Pokémon de este tipo
                </span>
            </header>

            <div className="type-overview-body">
                <p>
                El tipo <strong>{niceName}</strong> es uno de los tipos
                elementales de Pokémon. Tiene interacciones especiales de daño con
                otros tipos: puede ser muy efectivo, poco efectivo o incluso no
                afectarles.
                </p>
                <p>
                Utiliza esta información para construir equipos equilibrados y
                aprovechar las ventajas en combate.
                </p>
            </div>
            </article>

            {/* Tarjeta de relaciones de daño */}
            <article className="type-relations-card">
            <h2>Relaciones de daño</h2>

            <div className="relation-grid">
                <div className="relation-block">
                <h3>Hace daño x2 a</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.double_damage_to)}
                </div>
                </div>

                <div className="relation-block">
                <h3>Recibe daño x2 de</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.double_damage_from)}
                </div>
                </div>

                <div className="relation-block">
                <h3>Hace daño x½ a</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.half_damage_to)}
                </div>
                </div>

                <div className="relation-block">
                <h3>Recibe daño x½ de</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.half_damage_from)}
                </div>
                </div>

                <div className="relation-block">
                <h3>No hace daño a</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.no_damage_to)}
                </div>
                </div>

                <div className="relation-block">
                <h3>No recibe daño de</h3>
                <div className="relation-tags">
                    {renderTypeTags(damage_relations.no_damage_from)}
                </div>
                </div>
            </div>
            </article>
        </div>

        {/* Pokémon de ejemplo */}
        <section className="type-pokemon-section">
            <h2>Pokémon de tipo {data.name}</h2>
            <p className="type-pokemon-intro">
            Algunos Pokémon representativos de este tipo. Haz clic en ellos desde
            la lista general de Pokémon para ver su carta completa.
            </p>

            <ul className="type-pokemon-list">
            {samplePokemon.map((p) => (
                <li key={p.id} className="type-pokemon-chip">
                <div className="type-pokemon-avatar">
                    <img src={p.sprite} alt={p.name} />
                </div>
                <div className="type-pokemon-info">
                    <span className="type-pokemon-name">{p.name}</span>
                    <span className="type-pokemon-id">
                    #{String(p.id).padStart(3, "0")}
                    </span>
                </div>
                </li>
            ))}
            </ul>
        </section>
        </section>
    );
}

export default TypeDetailPage;