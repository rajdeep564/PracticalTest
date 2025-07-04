import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes from centralized index
import routeExports from './routes';

const { registerRoutes } = routeExports;
// Database initialization is now handled separately via npm run init-db

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - using centralized registration
registerRoutes(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server directly (database initialization handled separately)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log('💡 Run "npm run init-db" to initialize database if needed');
});
