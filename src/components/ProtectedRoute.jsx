import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Protege una ruta según autenticación y rol.
 *
 * @param {string} [requiredRole]  Si se indica, solo usuarios con ese rol pueden acceder.
 */
function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    // Guarda la ruta original para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
