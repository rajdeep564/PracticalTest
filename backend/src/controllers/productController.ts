import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import productExports, { CreateProductData } from '../models/Product';
import { PaginationParams } from '../models/Category';
import { getConnection } from '../config/database';
import { successResponse, errorResponse } from '../utils/apiResponse';

const { ProductModel } = productExports;

const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    connection = await getConnection();

    // Check if pagination parameters are provided
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (req.query.page || req.query.limit) {
      // Return paginated results
      const paginationParams: PaginationParams = { page, limit };
      const result = await ProductModel.findAllPaginated(connection, paginationParams);
      res.json(successResponse(result, 'Products fetched successfully'));
    } else {
      // Return all products (for backward compatibility)
      const products = await ProductModel.findAll(connection);
      res.json(successResponse(products, 'Products fetched successfully'));
    }
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();
    
    const product = await ProductModel.findById(connection, parseInt(id));
    if (!product) {
      return res.status(404).json(errorResponse('Product not found'));
    }
    
    res.json(successResponse(product, 'Product fetched successfully'));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const productData: CreateProductData = req.body;
    connection = await getConnection();
    
    const product = await ProductModel.create(connection, productData);
    res.status(201).json(successResponse(product, 'Product created successfully'));
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const productData: CreateProductData = req.body;
    connection = await getConnection();
    
    const updated = await ProductModel.update(connection, parseInt(id), productData);
    if (!updated) {
      return res.status(404).json(errorResponse('Product not found'));
    }
    
    res.json(successResponse({ id: parseInt(id), ...productData }, 'Product updated successfully'));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const deleted = await ProductModel.delete(connection, parseInt(id));
    if (!deleted) {
      return res.status(404).json(errorResponse('Product not found'));
    }

    res.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const productControllerExports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productControllerExports;
