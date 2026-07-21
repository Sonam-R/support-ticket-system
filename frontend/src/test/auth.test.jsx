import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clearAuth, getToken, isAuthenticated, setAuth } from '../utils/auth.js';
import * as authService from '../services/authService.js';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="redirect">{to}</div>,
  useLocation: () => ({ pathname: '/tickets' }),
  useNavigate: () => vi.fn(),
  MemoryRouter: ({ children }) => <>{children}</>,
}));

vi.mock('../services/authService.js', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}));

describe('auth storage utilities', () => {
  beforeEach(() => {
    clearAuth();
  });

  it('stores and clears auth data', () => {
    setAuth('token-123', { id: '1', name: 'Emma', email: 'emma@example.com', role: 'ADMIN' });
    expect(getToken()).toBe('token-123');
    expect(isAuthenticated()).toBe(true);
    clearAuth();
    expect(isAuthenticated()).toBe(false);
  });
});

describe('Login page', () => {
  beforeEach(async () => {
    clearAuth();
    vi.clearAllMocks();
    authService.getCurrentUser.mockRejectedValue(new Error('No token'));
    const { AuthProvider } = await import('../context/AuthContext.jsx');
    global.AuthProvider = AuthProvider;
  });

  it('logs in successfully', async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();

    vi.doMock('react-router-dom', () => ({
      Navigate: ({ to }) => <div data-testid="redirect">{to}</div>,
      useLocation: () => ({ pathname: '/tickets' }),
      useNavigate: () => mockNavigate,
      MemoryRouter: ({ children }) => <>{children}</>,
    }));

    authService.login.mockResolvedValue({
      token: 'test-token',
      user: { id: '1', name: 'Emma', email: 'emma@example.com', role: 'ADMIN' },
    });

    const Login = (await import('../pages/Login.jsx')).default;
    const { AuthProvider } = await import('../context/AuthContext.jsx');

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    await user.type(screen.getByLabelText(/email/i), 'emma@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('emma@example.com', 'Password123');
    });
  });

  it('shows error on login failure', async () => {
    const user = userEvent.setup();
    authService.login.mockRejectedValue(new Error('Invalid email or password'));

    const Login = (await import('../pages/Login.jsx')).default;
    const { AuthProvider } = await import('../context/AuthContext.jsx');

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    await user.type(screen.getByLabelText(/email/i), 'emma@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

describe('Logout', () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
  });

  it('clears auth state on logout', async () => {
    setAuth('token', { id: '1', name: 'Emma', email: 'emma@example.com', role: 'ADMIN' });
    authService.getCurrentUser.mockResolvedValue({
      id: '1',
      name: 'Emma',
      email: 'emma@example.com',
      role: 'ADMIN',
    });
    authService.logout.mockResolvedValue(undefined);

    const { AuthProvider, useAuth } = await import('../context/AuthContext.jsx');

    function LogoutTester() {
      const { logout, isAuthenticated } = useAuth();
      return (
        <div>
          <span>{isAuthenticated ? 'authenticated' : 'guest'}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      );
    }

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <LogoutTester />
      </AuthProvider>,
    );

    expect(await screen.findByText('authenticated')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(screen.getByText('guest')).toBeInTheDocument();
    });
  });
});

describe('Protected routes', () => {
  beforeEach(() => {
    clearAuth();
    vi.clearAllMocks();
    authService.getCurrentUser.mockRejectedValue(new Error('No token'));
  });

  it('redirects unauthenticated users to login', async () => {
    const { AuthProvider } = await import('../context/AuthContext.jsx');
    const ProtectedRoute = (await import('../components/ProtectedRoute.jsx')).default;

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
      expect(screen.getByTestId('redirect')).toHaveTextContent('/login');
    });
  });
});
