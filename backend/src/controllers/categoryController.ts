import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import categoryExports, { PaginationParams } from '../models/Category';
import { getConnection } from '../config/database';
import { successResponse, errorResponse } from '../utils/apiResponse';

const { CategoryModel } = categoryExports;

const getCategories = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    connection = await getConnection();

    // Check if pagination parameters are provided
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (req.query.page || req.query.limit) {
      // Return paginated results
      const paginationParams: PaginationParams = { page, limit };
      const result = await CategoryModel.findAllPaginated(connection, paginationParams);
      res.json(successResponse(result, 'Categories fetched successfully'));
    } else {
      // Return all categories (for backward compatibility)
      const categories = await CategoryModel.findAll(connection);
      res.json(successResponse(categories, 'Categories fetched successfully'));
    }
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { name } = req.body;
    connection = await getConnection();

    // Check if category with this name already exists
    const existingCategory = await CategoryModel.findByName(connection, name);
    if (existingCategory) {
      return res.status(400).json(errorResponse('Category with this name already exists'));
    }

    const category = await CategoryModel.create(connection, name);
    res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { name } = req.body;
    const categoryId = parseInt(id);
    connection = await getConnection();

    // Check if category with this name already exists (excluding current category)
    const existingCategory = await CategoryModel.findByName(connection, name, categoryId);
    if (existingCategory) {
      return res.status(400).json(errorResponse('Category with this name already exists'));
    }

    const updated = await CategoryModel.update(connection, categoryId, name);
    if (!updated) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    res.json(successResponse({ id: categoryId, name }, 'Category updated successfully'));
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const deleted = await CategoryModel.delete(connection, parseInt(id));
    if (!deleted) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    res.json(successResponse(null, 'Category deleted successfully'));
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};

const categoryControllerExports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryControllerExports;
