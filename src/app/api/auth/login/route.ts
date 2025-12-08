import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/validators/auth.validator';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * POST /api/auth/login
 * Authenticates a student and returns a JWT token
 * Requirements: 1.2
 */
async function loginHandler(request: NextRequest) {
  // Validate request body
  const validatedData = await validateRequest(request, loginSchema);

  // Authenticate student
  const authService = new AuthService();
  const loginResponse = await authService.login(
    validatedData.email,
    validatedData.password
  );

  // Return token and student data
  return successResponse({
    token: loginResponse.token,
    student: {
      studentId: loginResponse.student.student_id,
      email: loginResponse.student.email,
      firstName: loginResponse.student.first_name,
      lastName: loginResponse.student.last_name,
      role: loginResponse.student.role,
    },
  });
}

// Export with error handling middleware
export const POST = withErrorHandler(loginHandler);
