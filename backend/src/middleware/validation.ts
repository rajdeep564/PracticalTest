import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required').isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
];

export const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category_id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('colors').isArray({ min: 1 }).withMessage('At least one color is required'),
  body('colors.*').isIn(['Black', 'White', 'Yellow', 'Green', 'Blue', 'Red']).withMessage('Invalid color selected'),
  body('tags').isArray().withMessage('Tags must be an array')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errorResponse('Validation failed', errors.array().map(err => err.msg).join(', ')));
  }
  next();
};
