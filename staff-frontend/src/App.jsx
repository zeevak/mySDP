import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import StaffDashboard from './Pages/Staff/StaffDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import CustomerManager from './Pages/Staff/CustomerManager';
import InventoryManager from './Pages/Staff/InventoryManager';
import PlantShipment from './Pages/Staff/PlantShipment';
import StaffManager from './Pages/Admin/StaffManager';
import MessagesPage from './Pages/Staff/MessagesPage';
import AddCustomer from './Pages/Staff/AddCustomer';
import EditCustomer from './Pages/Staff/EditCustomer';
import AddCustomerLand from './Pages/Staff/AddCustomerLand';
import LandManager from './Pages/Staff/LandManager';
import EditLand from './Pages/Staff/EditLand';
import SelectCustomerForProposal from './Pages/Staff/SelectCustomerForProposal';
import CreateProposal from './Pages/Staff/CreateProposal';
import DashboardRedirect from './Components/DashboardRedirect';

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard redirect */}
        <Route path="/" element={<DashboardRedirect />} />

        {/* Protected routes - Staff */}
        <Route
          path="/staff/dashboard"
          element={<ProtectedRoute element={<StaffDashboard />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/customers"
          element={<ProtectedRoute element={<CustomerManager />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/add-customer"
          element={<ProtectedRoute element={<AddCustomer />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/edit-customer/:id"
          element={<ProtectedRoute element={<EditCustomer />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/add-land"
          element={<ProtectedRoute element={<AddCustomerLand />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/customers/:customerId/add-land"
          element={<ProtectedRoute element={<AddCustomerLand />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/lands"
          element={<ProtectedRoute element={<LandManager />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/edit-land/:id"
          element={<ProtectedRoute element={<EditLand />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/inventory"
          element={<ProtectedRoute element={<InventoryManager />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/shipments"
          element={<ProtectedRoute element={<PlantShipment />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/messages"
          element={<ProtectedRoute element={<MessagesPage />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/submit-proposal"
          element={<ProtectedRoute element={<SelectCustomerForProposal />} allowedRoles={['Staff', 'Admin']} />}
        />
        <Route
          path="/staff/create-proposal/:customerId"
          element={<ProtectedRoute element={<CreateProposal />} allowedRoles={['Staff', 'Admin']} />}
        />

        {/* Protected routes - Admin only */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['Admin']} />}
        />
        <Route
          path="/admin/staff"
          element={<ProtectedRoute element={<StaffManager />} allowedRoles={['Admin']} />}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
