import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <section className="page auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h1>Acceso denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <Link to="/" className="btn" style={{ marginTop: "1rem", display: "inline-block" }}>
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

export default UnauthorizedPage;
