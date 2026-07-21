import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { clearAuth, setAuth } from '../utils/auth.js';
import {
  canDeleteTickets,
  canManageTickets,
  canManageUsers,
  hasRole,
} from '../utils/permissions.js';

vi.mock('../services/authService.js', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

describe('permissions utilities', () => {
  const admin = { id: '1', role: 'ADMIN' };
  const agent = { id: '2', role: 'SUPPORT_AGENT' };
  const viewer = { id: '3', role: 'VIEWER' };

  it('checks role membership', () => {
    expect(hasRole(admin, 'ADMIN')).toBe(true);
    expect(hasRole(viewer, 'ADMIN')).toBe(false);
  });

  it('identifies user management access', () => {
    expect(canManageUsers(admin)).toBe(true);
    expect(canManageUsers(agent)).toBe(false);
    expect(canManageUsers(viewer)).toBe(false);
  });

  it('identifies ticket management access', () => {
    expect(canManageTickets(admin)).toBe(true);
    expect(canManageTickets(agent)).toBe(true);
    expect(canManageTickets(viewer)).toBe(false);
  });

  it('identifies ticket delete access', () => {
    expect(canDeleteTickets(admin)).toBe(true);
    expect(canDeleteTickets(agent)).toBe(false);
  });
});

describe('RoleProtectedRoute', () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
  });

  async function renderProtectedRoute(role) {
    setAuth('token', {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role,
    });

    const authService = await import('../services/authService.js');
    authService.getCurrentUser.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role,
    });

    const { AuthProvider } = await import('../context/AuthContext.jsx');
    const RoleProtectedRoute = (await import('../components/RoleProtectedRoute.jsx')).default;

    render(
      <MemoryRouter initialEntries={['/users']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/users"
              element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <div>User Management</div>
                </RoleProtectedRoute>
              }
            />
            <Route path="/forbidden" element={<div>Access Denied Page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
  }

  it('allows ADMIN to access admin routes', async () => {
    await renderProtectedRoute('ADMIN');
    expect(await screen.findByText('User Management')).toBeInTheDocument();
  });

  it('redirects SUPPORT_AGENT from admin routes', async () => {
    await renderProtectedRoute('SUPPORT_AGENT');
    expect(await screen.findByText('Access Denied Page')).toBeInTheDocument();
    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  });

  it('redirects VIEWER from admin routes', async () => {
    await renderProtectedRoute('VIEWER');
    expect(await screen.findByText('Access Denied Page')).toBeInTheDocument();
  });
});

describe('MainLayout navigation', () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
  });

  async function renderLayout(role) {
    setAuth('token', {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role,
    });

    const authService = await import('../services/authService.js');
    authService.getCurrentUser.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role,
    });

    const { AuthProvider } = await import('../context/AuthContext.jsx');
    const MainLayout = (await import('../layouts/MainLayout.jsx')).default;

    render(
      <MemoryRouter>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </MemoryRouter>,
    );
  }

  it('shows all menus for ADMIN', async () => {
    await renderLayout('ADMIN');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Tickets' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Create Ticket' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
    });
  });

  it('hides user management for SUPPORT_AGENT', async () => {
    await renderLayout('SUPPORT_AGENT');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Create Ticket' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    });
  });

  it('hides create ticket and user management for VIEWER', async () => {
    await renderLayout('VIEWER');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Tickets' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Create Ticket' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
    });
  });
});
