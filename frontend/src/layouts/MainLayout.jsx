import { NavLink, Outlet } from 'react-router-dom';

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
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
