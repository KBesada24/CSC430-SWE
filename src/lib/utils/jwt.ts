import jwt from 'jsonwebtoken';
import { AuthenticationError } from './error-handler';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  studentId: string;
  email: string;
  role?: 'student' | 'club_admin' | 'university_admin';
}

/**
 * Get JWT secret from environment variables
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

/**
 * Generates a JWT token for authenticated user
 * @param payload - Data to encode in the token
 * @param expiresIn - Token expiration time (default: 24 hours)
 * @returns Signed JWT token
 */
export function generateToken(
  payload: JwtPayload,
  expiresIn: string | number = '24h'
): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
}

/**
 * Extracts token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null if not found
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
