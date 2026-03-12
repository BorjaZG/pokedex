import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, username: form.username });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="username">Nombre de entrenador</label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Ash Ketchum"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="entrenador@pokemon.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Repite la contraseña"
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="btn auth-submit" disabled={loading}>
            {loading ? "Registrando…" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
