import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface JWTDecodeResult {
  success: boolean;
  payload?: JWTPayload;
  error?: string;
}

// Decode JWT token without verification (frontend doesn't have secret)
export const decodeToken = (token: string): JWTDecodeResult => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded) {
      return {
        success: false,
        error: 'Invalid token format'
      };
    }

    return {
      success: true,
      payload: decoded
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to decode token'
    };
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded || !decoded.exp) {
      return true; // Consider invalid tokens as expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // Consider invalid tokens as expired
  }
};

// Get user info from token
export const getUserFromToken = (token: string): JWTPayload | null => {
  const result = decodeToken(token);
  return result.success ? result.payload || null : null;
};

// Check if user has admin role
export const isAdmin = (token: string): boolean => {
  const user = getUserFromToken(token);
  return user?.role === 'admin';
};

// Check if user has user role
export const isUser = (token: string): boolean => {
  const user = getUserFromToken(token);
  return user?.role === 'user';
};

// Get token expiration time as Date
export const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Get time remaining until token expires (in seconds)
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - currentTime;

    return Math.max(0, timeRemaining);
  } catch (error) {
    return 0;
  }
};

// Format time remaining in human readable format
export const formatTokenTimeRemaining = (token: string): string => {
  const seconds = getTokenTimeRemaining(token);
  
  if (seconds <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Validate token structure (basic check)
export const isValidTokenStructure = (token: string): boolean => {
  try {
    const parts = token.split('.');
    return parts.length === 3; // JWT should have 3 parts: header.payload.signature
  } catch (error) {
    return false;
  }
};
