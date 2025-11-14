import { NextRequest } from 'next/server';
import { extractTokenFromHeader, verifyToken, JwtPayload } from '@/lib/utils/jwt';
import { AuthenticationError } from '@/lib/utils/error-handler';

/**
 * Extended request type with authenticated student information
 */
export interface AuthenticatedRequest extends NextRequest {
  student?: JwtPayload;
}

/**
 * Extracts and verifies JWT token from request headers
 * Attaches decoded student information to the request
 * 
 * @param request - Next.js request object
 * @returns Decoded JWT payload with student information
 * @throws AuthenticationError if token is missing or invalid
 */
export function authenticateRequest(request: NextRequest): JwtPayload {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  // Verify and decode token
  const payload = verifyToken(token);
  return payload;
}

/**
 * Higher-order function to wrap API route handlers with authentication
 * 
 * @param handler - The API route handler function
 * @returns Wrapped handler with authentication
 */
export function withAuth<T>(
  handler: (request: NextRequest, student: JwtPayload, context?: T) => Promise<Response>
) {
  return async (request: NextRequest, context?: T): Promise<Response> => {
    const student = authenticateRequest(request);
    return handler(request, student, context);
  };
}
