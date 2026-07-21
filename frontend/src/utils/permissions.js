export function hasRole(user, ...roles) {
  return Boolean(user && roles.includes(user.role));
}

export function canManageUsers(user) {
  return hasRole(user, 'ADMIN');
}

export function canManageTickets(user) {
  return hasRole(user, 'ADMIN', 'SUPPORT_AGENT');
}

export function canDeleteTickets(user) {
  return hasRole(user, 'ADMIN');
}
