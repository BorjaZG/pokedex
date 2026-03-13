import { NavLink, Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

function Header() {
    const { theme, toggleTheme } = useThemeContext();
    const { favorites } = useFavorites();
    const { user, logout } = useAuth();

    return (
        <header className="app-header">
        <div className="header-left">
            <Link to="/" className="logo">
            PokéDex Explorer
            </Link>

            <nav className="main-nav">
            <NavLink to="/pokemon">Pokémon</NavLink>
            <NavLink to="/types">Tipos</NavLink>
            {user && (
                <NavLink to="/favorites" className="nav-favorites">
                ♥ Favoritos
                {favorites.length > 0 && (
                    <span className="favorites-badge">{favorites.length}</span>
                )}
                </NavLink>
            )}
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            </nav>
        </div>

        <div className="header-right">
            {user ? (
            <div className="header-user">
                <span className="header-username">
                {user.user_metadata?.username ?? user.email}
                </span>
                <button type="button" className="btn secondary btn-sm" onClick={logout}>
                Salir
                </button>
            </div>
            ) : (
            <Link to="/login" className="btn btn-sm">
                Iniciar sesión
            </Link>
            )}

            <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar tema"
            >
            {theme === "dark" ? "🌙" : "☀️"}
            </button>
        </div>
        </header>
    );
}

export default Header;
