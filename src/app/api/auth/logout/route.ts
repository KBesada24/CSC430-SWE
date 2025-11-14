import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { extractTokenFromHeader } from '@/lib/utils/jwt';

/**
 * POST /api/auth/logout
 * Logs out the authenticated student (invalidates session)
 * Requirements: 1.5
 */
async function logoutHandler(request: NextRequest) {
  // Authenticate request
  authenticateRequest(request);

  // Extract token for logout
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (token) {
    const authService = new AuthService();
    await authService.logout(token);
  }

  // Return success response
  return successResponse({
    message: 'Logged out successfully',
  });
}

// Export with error handling middleware
export const POST = withErrorHandler(logoutHandler);
