export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const hasRole = (user, role) => {
  if (!user) {
    return false;
  }

  return user.role === role;
};

export const isAdmin = user => {
  return user && user.role === ROLES.ADMIN;
};