import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import TicketList from '../pages/TicketList.jsx';
import CreateTicket from '../pages/CreateTicket.jsx';
import TicketDetails from '../pages/TicketDetails.jsx';
import UserList from '../pages/UserList.jsx';
import CreateUser from '../pages/CreateUser.jsx';
import UserDetails from '../pages/UserDetails.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/users/:id/edit" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
