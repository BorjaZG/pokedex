function Footer() {
    return (
        <footer className="pokedex-footer">
        <div className="footer-content">

            {/* Pokéball */}
            <img
            className="pokeball-pixel"
            alt="PokéBall"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            />

            <div className="footer-center">
            <p className="footer-title">PokéDex Explorer</p>
            <p className="footer-subtitle">
                Proyecto de Desarrollo de Interfaces · Datos por{" "}
                <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
                PokéAPI
                </a>
            </p>
            </div>

            <span className="footer-year">© {new Date().getFullYear()}</span>
        </div>
        </footer>
    );
}

export default Footer;