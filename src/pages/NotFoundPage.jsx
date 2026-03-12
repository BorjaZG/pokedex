import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <section className="page">
        <h1>404 - Página no encontrada</h1>
        <p>La página que buscas no existe.</p>
        <Link to="/" className="btn">
            Volver al inicio
        </Link>
        </section>
    );
}

export default NotFoundPage;
