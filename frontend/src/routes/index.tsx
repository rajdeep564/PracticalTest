import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/dashboard/Dashboard';
import CategoryList from '../components/categories/CategoryList';
import ProductList from '../components/products/ProductList';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Define route configuration
const routeConfig = {
  // Public routes
  public: {
    login: '/login',
  },
  
  // Protected routes
  protected: {
    dashboard: '/dashboard',
    categories: '/categories',
    products: '/products',
  },
  
  // Default redirects
  redirects: {
    root: '/dashboard',
    fallback: '/login',
  }
};

// Create the router with modular structure
const router = createBrowserRouter([
  {
    path: routeConfig.public.login,
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={routeConfig.redirects.root} replace />,
      },
      {
        path: routeConfig.protected.dashboard,
        element: <Dashboard />,
      },
      {
        path: routeConfig.protected.categories,
        element: (
          <ProtectedRoute requiredRole="admin">
            <CategoryList />
          </ProtectedRoute>
        ),
      },
      {
        path: routeConfig.protected.products,
        element: <ProductList />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={routeConfig.redirects.fallback} replace />,
  },
]);

// Export router and route configuration
const routeExports = {
  router,
  routeConfig,
};

export default routeExports;
