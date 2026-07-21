import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Tickets from '../pages/Tickets.jsx';
import CreateTicket from '../pages/CreateTicket.jsx';
import TicketDetails from '../pages/TicketDetails.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
