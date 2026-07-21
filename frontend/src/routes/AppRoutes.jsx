import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import TicketList from '../pages/TicketList.jsx';
import CreateTicket from '../pages/CreateTicket.jsx';
import TicketDetails from '../pages/TicketDetails.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
