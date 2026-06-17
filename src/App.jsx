import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Pages
import Dashboard from './pages/dashboard/Dashboard';
import Warehouse from './pages/warehouse/Warehouse';
import CreateWarehouseBatch from './pages/warehouse/CreateWarehouseBatch';
import Products from './pages/products/Products';
import CreateProduct from './pages/products/CreateProduct';
import Schools from './pages/schools/Schools';
import Customers from './pages/customers/Customers';
import Orders from './pages/orders/Orders';
import CreateOrder from './pages/orders/CreateOrder';
import Tailoring from './pages/tailoring/Tailoring';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/warehouse/create-batch" element={<CreateWarehouseBatch />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create-product" element={<CreateProduct />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/create-order" element={<CreateOrder />} />
          <Route path="/tailoring" element={<Tailoring />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
