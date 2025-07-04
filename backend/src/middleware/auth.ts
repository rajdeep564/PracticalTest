import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { errorResponse } from '../utils/apiResponse';
import { verifyToken } from '../utils/jwt';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  if (!token) {
    return res.status(401).json(errorResponse('Access denied. No token provided.'));
  }

  const verifyResult = verifyToken(token);

  if (!verifyResult.success || !verifyResult.payload) {
    return res.status(401).json(errorResponse(verifyResult.error || 'Invalid token'));
  }

  req.user = verifyResult.payload;
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json(errorResponse('Admin access required'));
  }
  next();
};
