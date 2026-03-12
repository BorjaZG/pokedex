import { useParams, Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { pokemonService } from "../services/pokemonService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

// Colores por tipo para darle rollo a la carta
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
};

function PokemonDetailPage() {
    const { id } = useParams();
    const { data, loading, error } = useAsync(() => pokemonService.getById(id), [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!data) return null;

    const sprite =
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default;

    const mainType = data.types[0]?.type.name;
    const typeColor = TYPE_COLORS[mainType] || "#e5e7eb";

    const paddedId = String(data.id).padStart(3, "0");

    return (
        <section className="page pokemon-detail">
        <Link to="/pokemon" className="back-link">
            ← Volver a la lista
        </Link>

        <div className="pokemon-card-detail">
            <article
            className="pk-card"
            style={{
                borderColor: typeColor,
                boxShadow: `0 10px 20px ${typeColor}55`,
            }}
            >
            {/* CABECERA DE LA CARTA */}
            <header className="pk-card-header">
                <span className="pk-card-name">{data.name}</span>
                <span className="pk-card-id">N.º {paddedId}</span>
            </header>

            {/* TIPOS */}
            <div className="pk-card-types">
                {data.types.map((t) => (
                <span key={t.slot} className="pk-type-pill">
                    {t.type.name}
                </span>
                ))}
            </div>

            {/* IMAGEN DENTRO DE LA CARTA */}
            <div className="pk-card-image-wrapper">
                <div
                className="pk-card-image-bg"
                style={{ background: `${typeColor}33` }}
                >
                <img src={sprite} alt={data.name} />
                </div>
            </div>

            {/* ZONA DE INFO INFERIOR */}
            <footer className="pk-card-footer">
                <div className="pk-card-basic">
                <span>
                    <strong>Altura:</strong> {data.height}
                </span>
                <span>
                    <strong>Peso:</strong> {data.weight}
                </span>
                </div>

                <div className="pk-card-stats">
                {data.stats.map((stat) => (
                    <div key={stat.stat.name} className="pk-card-stat-row">
                    <span className="pk-card-stat-name">
                        {stat.stat.name.replace("-", " ")}
                    </span>
                    <span className="pk-card-stat-bar">
                        <span
                        className="pk-card-stat-fill"
                        style={{
                            width: `${Math.min(stat.base_stat, 120)}%`,
                        }}
                        />
                    </span>
                    <span className="pk-card-stat-value">
                        {stat.base_stat}
                    </span>
                    </div>
                ))}
                </div>
            </footer>
            </article>
        </div>
        </section>
    );
}

export default PokemonDetailPage;
