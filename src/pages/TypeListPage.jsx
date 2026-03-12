import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { typeService } from "../services/typeService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import OakDialog from "../components/OakDialog";

// Mapa de colores por tipo (igual que en el detalle)
const TYPE_COLORS = {
    normal: "#e5e7eb",
    fire: "#3c2514",
    water: "#1c4b98ff",
    grass: "#0c3d1e",
    electric: "rgb(236, 221, 10)",
    ice: "#365563ff",
    fighting: "#6b1e1eff",
    poison: "#a855f7",
    ground: "#d97757",
    flying: "#a5b4fc",
    psychic: "#ec4899",
    bug: "#84cc16",
    rock: "#a8a29e",
    ghost: "#6b21a8",
    dragon: "#8b5cf6",
    dark: "#3f2e78",
    steel: "#5c6067ff",
    fairy: "#f9a8d4",
    stellar: "#38bdf8",
};

// Emoji por tipo para darle más personalidad
const TYPE_EMOJI = {
    fire: "🔥",
    water: "💧",
    grass: "🍃",
    electric: "⚡",
    ice: "❄️",
    rock: "🪨",
    ground: "🌋",
    flying: "🕊️",
    bug: "🐞",
    psychic: "🔮",
    ghost: "👻",
    dark: "🌑",
    dragon: "🐉",
    fairy: "✨",
    steel: "⚙️",
    fighting: "🥊",
    normal: "⭐",
    poison: "☠️",
    stellar: "🌟",
};

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function TypeListPage() {
    const { data, loading, error } = useAsync(() => typeService.getList(), []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!data) return null;

    const types = data.results
        .filter((t) => t.name !== "shadow" && t.name !== "unknown")
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <section className="page">
        <h1>Tipos Pokémon</h1>

        <OakDialog>
        <p>
            Los tipos Pokémon representan afinidades elementales como <strong>fuego</strong>,
            <strong> agua</strong>, <strong>planta</strong> o <strong>eléctrico</strong>.
        </p>
        <p>
            Cada tipo tiene fortalezas y debilidades frente a otros. Haz clic en un tipo
            para ver sus relaciones de daño y una lista de Pokémon pertenecientes a él.
        </p>
        </OakDialog>


        <div className="type-layout">

            <div className="type-grid">
            {types.map((type) => {
                const bg = TYPE_COLORS[type.name] || "#e5e7eb";
                const emoji = TYPE_EMOJI[type.name] || "⭐";

                return (
                <Link
                    key={type.name}
                    to={`/types/${type.name}`}
                    className="type-card-link"
                >
                    <article className="type-card">
                    <div className="type-card-header">
                        <div
                        className="type-card-emoji"
                        style={{ backgroundColor: bg }}
                        >
                        {emoji}
                        </div>
                        <h2>{capitalize(type.name)}</h2>
                    </div>
                    <p className="type-card-text">
                        Ver relaciones de daño y algunos Pokémon del tipo{" "}
                        {type.name}.
                    </p>
                    </article>
                </Link>
                );
            })}
            </div>
        </div>
        </section>
    );
}

export default TypeListPage;