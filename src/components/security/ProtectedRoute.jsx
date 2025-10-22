import { Navigate, useLocation } from 'react-router-dom';
import { clearAuth, getToken, hasRole, isTokenExpired } from '@/services/authService';

/**
 * ProtectedRoute
 * - Protège l'accès aux routes sensibles (ici, /admin/*)
 * - Vérifie présence/expiration du token et rôles autorisés
 * - Redirige vers /404 si non autorisé pour masquer l'existence des pages
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();

  const token = getToken();
  const expired = token ? isTokenExpired(token) : true;
  const authorized = token && !expired && hasRole(allowedRoles, token);

  if (!token) {
    return <Navigate to="/404" replace state={{ from: location }} />;
  }
  if (expired) {
    clearAuth();
    return <Navigate to="/404" replace state={{ from: location }} />;
  }
  if (!authorized) {
    return <Navigate to="/404" replace state={{ from: location }} />;
  }

  return children || null;
};

export default ProtectedRoute;
