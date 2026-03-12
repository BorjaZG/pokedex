function PokemonCard({ pokemon }) {
    const { id, name, sprite } = pokemon;

    return (
        <article className="card pokemon-card">
        <img src={sprite} alt={name} />
        <h3>
            #{id} {name}
        </h3>
        </article>
    );
}

export default PokemonCard;