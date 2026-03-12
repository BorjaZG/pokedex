function OakDialog({ title = "Profesor Oak", sprite, children }) {
    return (
        <section className="oak-welcome reusable-dialog">
        <div className="oak-avatar">
            <img
            src={
                sprite ||
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            }
            alt={title}
            />
            <span>{title}</span>
        </div>

        <div className="oak-dialog">
            {children}
        </div>
        </section>
    );
}

export default OakDialog;