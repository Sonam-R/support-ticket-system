import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import RoleProtectedRoute from '../components/RoleProtectedRoute.jsx';
import Login from '../pages/Login.jsx';
import Forbidden from '../pages/Forbidden.jsx';
import TicketList from '../pages/TicketList.jsx';
import CreateTicket from '../pages/CreateTicket.jsx';
import TicketDetails from '../pages/TicketDetails.jsx';
import UserList from '../pages/UserList.jsx';
import CreateUser from '../pages/CreateUser.jsx';
import UserDetails from '../pages/UserDetails.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route
          path="/tickets/create"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN', 'SUPPORT_AGENT']}>
              <CreateTicket />
            </RoleProtectedRoute>
          }
        />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route
          path="/users"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserList />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <CreateUser />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserDetails />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserDetails />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
