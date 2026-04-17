import { createContext, useContext } from 'react';
import { AuthContext } from '../App';

const RoleContext = createContext(null);

export const ROLE_HIERARCHY = {
  rep: 1,
  manager: 2,
  director: 3,
  org_admin: 4,
  admin: 5,
};

export const hasRolePermission = (userRole, requiredRole) => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const hasRole = (role) => {
    if (!user?.role) return false;
    return (ROLE_HIERARCHY[user.role] || 0) >= (ROLE_HIERARCHY[role] || 0);
  };

  const hasAnyRole = (roles) => {
    if (!user?.role) return false;
    return roles.some(role => hasRole(role));
  };

  const hasAllRoles = (roles) => {
    if (!user?.role) return false;
    return roles.every(role => hasRole(role));
  };

  const getRoleLevel = () => {
    return ROLE_HIERARCHY[user?.role] || 0;
  };

  const getRoleLabel = (role) => {
    const labels = {
      rep: 'Representante',
      manager: 'Gerente',
      director: 'Director',
      org_admin: 'Admin de Organización',
      admin: 'Administrador del Sistema',
    };
    return labels[role] || role;
  };

  const value = {
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getRoleLevel,
    getRoleLabel,
    ROLE_HIERARCHY,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};
