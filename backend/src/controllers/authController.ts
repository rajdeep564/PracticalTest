import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { getConnection } from '../config/database';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { signToken } from '../utils/jwt';
import { LoginRequest } from '../types/auth';

export const login = async (req: Request, res: Response) => {
  let connection;
  try {
    const { email, password }: LoginRequest = req.body;
    connection = await getConnection();
    
    const user = await UserModel.findByEmail(connection, email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isValid = await UserModel.validatePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json(successResponse({ token, role: user.role }, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(errorResponse('Server error'));
  } finally {
    if (connection) connection.release();
  }
};
