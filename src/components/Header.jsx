import { NavLink, Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
    const { theme, toggleTheme } = useThemeContext();
    const { favorites } = useFavorites();

    return (
        <header className="app-header">
        <div className="header-left">
            <Link to="/" className="logo">
            PokéDex Explorer
            </Link>

            <nav className="main-nav">
            <NavLink to="/pokemon">Pokémon</NavLink>
            <NavLink to="/types">Tipos</NavLink>
            <NavLink to="/favorites" className="nav-favorites">
                ♥ Favoritos
                {favorites.length > 0 && (
                <span className="favorites-badge">{favorites.length}</span>
                )}
            </NavLink>
            </nav>
        </div>

        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar tema"
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
        </header>
    );
}

export default Header;
