import { NextRequest } from 'next/server';
import { StudentService } from '@/lib/services/student.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireSelfAccess } from '@/lib/middleware/authorization.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { z } from 'zod';

const updateStudentSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional(),
});

/**
 * GET /api/students/[id]
 * Retrieves a student profile by ID
 * Requirements: 1.3
 */
async function getStudentHandler(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const studentId = context.params.id;

  const studentService = new StudentService();
  const student = await studentService.getById(studentId);

  return successResponse({
    studentId: student.student_id,
    email: student.email,
    firstName: student.first_name,
    lastName: student.last_name,
    createdAt: student.created_at,
  });
}

/**
 * PATCH /api/students/[id]
 * Updates a student profile
 * Requirements: 1.4
 */
async function updateStudentHandler(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const studentId = context.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student can only update their own profile
  requireSelfAccess(studentId, authenticatedStudent.studentId);

  // Validate request body
  const validatedData = await validateRequest(request, updateStudentSchema);

  // Update student
  const studentService = new StudentService();
  const updatedStudent = await studentService.update(studentId, validatedData);

  return successResponse({
    studentId: updatedStudent.student_id,
    email: updatedStudent.email,
    firstName: updatedStudent.first_name,
    lastName: updatedStudent.last_name,
    createdAt: updatedStudent.created_at,
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getStudentHandler);
export const PATCH = withErrorHandler(updateStudentHandler);
