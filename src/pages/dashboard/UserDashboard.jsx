import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAsync } from "../../hooks/useAsync";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { pokemonService } from "../../services/pokemonService";
import StatCard from "../../components/dashboard/StatCard";
import PokemonTable from "../../components/dashboard/PokemonTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

function UserDashboard() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const username = user?.user_metadata?.username ?? user?.email ?? "Entrenador";

  const { data, loading, error } = useAsync(
    () =>
      favorites.length > 0
        ? Promise.all(favorites.map((id) => pokemonService.getById(id)))
        : Promise.resolve([]),
    [favorites.join(",")]
  );

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Tipo más frecuente entre favoritos
    const typeCounts = {};
    data.forEach((p) =>
      p.types.forEach(({ type }) => {
        typeCounts[type.name] = (typeCounts[type.name] ?? 0) + 1;
      })
    );
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];

    // Más fuerte
    const strongest = data.reduce((best, p) => {
      const total = p.stats.reduce((s, st) => s + st.base_stat, 0);
      const bestTotal = best.stats.reduce((s, st) => s + st.base_stat, 0);
      return total > bestTotal ? p : best;
    });

    return { topType, strongest };
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} />;

  const isEmpty = !data || data.length === 0;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Mi Pokédex</h1>
      <p className="dashboard-subtitle">
        Bienvenido/a, <strong>{username}</strong>
      </p>

      {isEmpty ? (
        <div className="dashboard-empty">
          <p>Aún no tienes Pokémon favoritos.</p>
          <Link to="/pokemon" className="btn">
            Explorar Pokémon
          </Link>
        </div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Mis favoritos" value={favorites.length} icon="♥" accent />
            <StatCard label="Tipo favorito" value={stats?.topType ?? "—"} icon="🏷️" />
            <StatCard label="El más fuerte" value={stats?.strongest.name ?? "—"} icon="⚡" />
          </div>

          <section className="dashboard-section">
            <h2>Mis Pokémon favoritos</h2>
            <PokemonTable pokemons={data} />
          </section>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
