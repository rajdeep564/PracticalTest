import express from 'express';
import productControllerExports from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { productValidation, handleValidationErrors } from '../middleware/validation';

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = productControllerExports;

const router = express.Router();

// All product routes require authentication
router.use(authenticateToken);

// Get all products (accessible to all authenticated users)
router.get('/', getProducts);

// Get single product (accessible to all authenticated users)
router.get('/:id', getProduct);

// Admin-only routes
router.post('/', requireAdmin, productValidation, handleValidationErrors, createProduct);
router.put('/:id', requireAdmin, productValidation, handleValidationErrors, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

const productRouteExports = {
  router,
};

export default productRouteExports;
