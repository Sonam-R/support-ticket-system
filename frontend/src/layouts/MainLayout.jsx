import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  {
    to: '/tickets',
    label: 'Tickets',
    isActive: (_, { pathname }) =>
      pathname === '/tickets' ||
      (pathname.startsWith('/tickets/') && pathname !== '/tickets/create'),
  },
  {
    to: '/tickets/create',
    label: 'Create Ticket',
    isActive: (_, { pathname }) => pathname === '/tickets/create',
  },
  {
    to: '/users',
    label: 'Users',
    isActive: (_, { pathname }) => pathname.startsWith('/users'),
  },
];

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo">Support Desk</span>
          <nav className="app-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                isActive={link.isActive}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="app-header-actions">
            {user && <span className="app-user-name">{user.name}</span>}
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
