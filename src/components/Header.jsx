import { NavLink, Link } from "react-router-dom";

function Header({ theme, onToggleTheme }) {
    return (
        <header className="app-header">
        <div className="header-left">
            <Link to="/" className="logo">
            PokéDex Explorer
            </Link>

            <nav className="main-nav">
            <NavLink to="/pokemon">Pokémon</NavLink>
            <NavLink to="/types">Tipos</NavLink>
            </nav>
        </div>

        {/* Toggle tema claro / oscuro */}
        <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar tema"
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
        </header>
    );
}

export default Header;
