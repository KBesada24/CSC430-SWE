import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/validators/auth.validator';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * POST /api/auth/register
 * Registers a new student account
 * Requirements: 1.1
 */
async function registerHandler(request: NextRequest) {
  // Validate request body
  const validatedData = await validateRequest(request, registerSchema);

  // Create new student
  const authService = new AuthService();
  const student = await authService.register(validatedData);

  // Return student data without password
  return successResponse(
    {
      studentId: student.student_id,
      email: student.email,
      firstName: student.first_name,
      lastName: student.last_name,
      role: student.role,
    },
    201
  );
}

// Export with error handling middleware
export const POST = withErrorHandler(registerHandler);
