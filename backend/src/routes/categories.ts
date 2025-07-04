import express from 'express';
import categoryControllerExports from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { categoryValidation, handleValidationErrors } from '../middleware/validation';

const { getCategories, createCategory, updateCategory, deleteCategory } = categoryControllerExports;

const router = express.Router();

// All category routes require authentication
router.use(authenticateToken);

// Get all categories (accessible to all authenticated users)
router.get('/', getCategories);

// Admin-only routes
router.post('/', requireAdmin, categoryValidation, handleValidationErrors, createCategory);
router.put('/:id', requireAdmin, categoryValidation, handleValidationErrors, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

const categoryRouteExports = {
  router,
};

export default categoryRouteExports;
