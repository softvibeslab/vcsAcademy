import { Navigate } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { useAuth } from '../../App';

export const RoleGuard = ({ children, allowedRoles, requireAll = false }) => {
  const { user, loading } = useAuth();
  const { hasAnyRole, hasAllRoles } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = requireAll
    ? hasAllRoles(allowedRoles)
    : hasAnyRole(allowedRoles);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">
            Acceso Restringido
          </h1>
          <p className="text-[#94A3B8] mb-6">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-[#64748B]">
            Tu rol actual: <span className="font-semibold">{user.role || 'sin rol'}</span>
          </p>
          <p className="text-sm text-[#64748B] mb-6">
            Roles requeridos: {allowedRoles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#D4AF37] text-[#020204] font-semibold py-2 px-6 rounded-lg hover:bg-[#B5952F] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return children;
};
