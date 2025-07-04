import authRoutes from './auth';
import categoryRouteExports from './categories';
import productRouteExports from './products';

// Extract routers from exports
const { router: categoryRoutes } = categoryRouteExports;
const { router: productRoutes } = productRouteExports;

// Route configuration for easy reference
const routeConfig = {
  auth: '/api/users',
  categories: '/api/categories',
  products: '/api/products',
};

// Centralized route exports
const routeExports = {
  // Individual route routers
  authRoutes,
  categoryRoutes,
  productRoutes,

  // Route configuration
  routeConfig,

  // Helper function to get all routes as an array
  getAllRoutes: () => [
    { path: routeConfig.auth, router: authRoutes },
    { path: routeConfig.categories, router: categoryRoutes },
    { path: routeConfig.products, router: productRoutes },
  ],

  // Helper function to register all routes on an Express app
  registerRoutes: (app: any) => {
    app.use(routeConfig.auth, authRoutes);
    app.use(routeConfig.categories, categoryRoutes);
    app.use(routeConfig.products, productRoutes);
  },
};

export default routeExports;
