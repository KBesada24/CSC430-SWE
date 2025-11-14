import { NextRequest } from 'next/server';
import { StudentService } from '@/lib/services/student.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/students/[id]/memberships
 * Retrieves all club memberships for a student
 * Requirements: 3.4
 */
async function getMembershipsHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const studentId = params.id;

  // Authenticate request
  authenticateRequest(request);

  // Get memberships
  const studentService = new StudentService();
  const memberships = await studentService.getMemberships(studentId);

  return successResponse({
    memberships: memberships.map((membership) => ({
      studentId: membership.student_id,
      clubId: membership.club_id,
      status: membership.status,
      createdAt: membership.created_at,
      club: {
        clubId: membership.club.club_id,
        name: membership.club.name,
        description: membership.club.description,
        category: membership.club.category,
        coverPhotoUrl: membership.club.cover_photo_url,
        adminStudentId: membership.club.admin_student_id,
        createdAt: membership.club.created_at,
      },
    })),
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getMembershipsHandler);
