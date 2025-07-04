import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface JWTResult {
  success: boolean;
  payload?: JWTPayload;
  error?: string;
}

// Sign JWT token with user data
export const signToken = (payload: { id: number; email: string; role: 'admin' | 'user' }): string => {
  try {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn']
    };
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    throw new Error('Failed to sign JWT token');
  }
};

// Verify and decode JWT token
export const verifyToken = (token: string): JWTResult => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    return {
      success: true,
      payload: decoded
    };
  } catch (error) {
    let errorMessage = 'Invalid token';

    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Invalid token format';
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = 'Token not active yet';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Decode JWT token without verification (for debugging)
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Legacy functions for backward compatibility
export const generateToken = (payload: { id: number; email: string; role: 'admin' | 'user' }): string => {
  return signToken(payload);
};

// Refresh token (generate new token with same payload but extended expiry)
export const refreshToken = (oldToken: string): string | null => {
  const verifyResult = verifyToken(oldToken);

  if (!verifyResult.success || !verifyResult.payload) {
    return null;
  }

  // Create new token with same user data
  const { id, email, role } = verifyResult.payload;
  return signToken({ id, email, role });
};
