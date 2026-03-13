import { useMemo } from "react";
import { useAsync } from "../../hooks/useAsync";
import { pokemonService } from "../../services/pokemonService";
import StatCard from "../../components/dashboard/StatCard";
import PokemonTable from "../../components/dashboard/PokemonTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

function AdminDashboard() {
  const { data, loading, error } = useAsync(
    () => pokemonService.getAllDetails(),
    []
  );

  const stats = useMemo(() => {
    if (!data) return null;

    const totals = data.map((p) =>
      p.stats.reduce((s, st) => s + st.base_stat, 0)
    );
    const strongest = data[totals.indexOf(Math.max(...totals))];

    const typeCount = new Set(
      data.flatMap((p) => p.types.map((t) => t.type.name))
    ).size;

    const avgTotal = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);

    return { strongest, typeCount, avgTotal };
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel de administración</h1>
      <p className="dashboard-subtitle">
        Vista completa de los 151 Pokémon de la Gen-I
      </p>

      <div className="stat-grid">
        <StatCard label="Pokémon registrados" value={151} icon="📋" />
        <StatCard label="Tipos únicos" value={stats.typeCount} icon="🏷️" />
        <StatCard label="Más poderoso" value={stats.strongest.name} icon="⚡" accent />
        <StatCard label="Media base total" value={stats.avgTotal} icon="📊" />
      </div>

      <section className="dashboard-section">
        <h2>Pokédex completa</h2>
        <PokemonTable pokemons={data} />
      </section>
    </div>
  );
}

export default AdminDashboard;
