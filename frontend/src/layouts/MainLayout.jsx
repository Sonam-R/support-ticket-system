import { NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/tickets', label: 'Tickets' },
  { to: '/tickets/create', label: 'Create Ticket' },
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
