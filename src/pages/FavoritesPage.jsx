import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import OakDialog from "../components/OakDialog";
import CardGrid from "../components/CardGrid";

function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();

    return (
        <section className="page">
        <div className="page-header">
            <h1>Mis Favoritos</h1>
            <p>Los Pokémon que has guardado como favoritos.</p>
        </div>

        <OakDialog>
            <p>
            Aquí encontrarás todos los Pokémon que has marcado como{" "}
            <strong>favoritos</strong> desde su página de detalle.
            </p>
            <p>
            Haz clic en cualquier carta para ver su información completa, o usa
            el botón ✕ para eliminarlo de tu lista.
            </p>
        </OakDialog>

        {favorites.length === 0 ? (
            <div className="favorites-empty">
            <p>Aún no tienes ningún favorito.</p>
            <Link to="/pokemon" className="btn">
                Explorar Pokémon
            </Link>
            </div>
        ) : (
            <CardGrid>
            {favorites.map((id) => {
                const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                return (
                <div key={id} className="card pokemon-card favorites-card">
                    <Link to={`/pokemon/${id}`} className="favorites-card-link">
                    <img src={spriteUrl} alt={`Pokémon #${id}`} />
                    <p>#{String(id).padStart(3, "0")}</p>
                    </Link>
                    <button
                    type="button"
                    className="btn-remove-favorite"
                    onClick={() => removeFavorite(id)}
                    aria-label="Quitar de favoritos"
                    >
                    ✕
                    </button>
                </div>
                );
            })}
            </CardGrid>
        )}
        </section>
    );
}

export default FavoritesPage;
