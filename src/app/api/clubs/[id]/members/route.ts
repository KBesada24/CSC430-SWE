import { NextRequest } from 'next/server';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { validateQueryParams } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { membershipStatusFilterSchema } from '@/lib/validators/club.validator';

/**
 * GET /api/clubs/[id]/members
 * Retrieves club members with optional status filter
 * Requirements: 4.3
 */
async function getMembersHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  // Parse query parameters
  const queryParams = validateQueryParams(request, membershipStatusFilterSchema);

  const clubService = new ClubService();
  const members = await clubService.getMembers(clubId, queryParams.status);

  return successResponse({
    members: members.map((member) => ({
      studentId: member.student_id,
      clubId: member.club_id,
      status: member.status,
      createdAt: member.created_at,
      student: {
        studentId: member.student.student_id,
        email: member.student.email,
        firstName: member.student.first_name,
        lastName: member.student.last_name,
      },
    })),
  });
}

/**
 * POST /api/clubs/[id]/members
 * Adds authenticated student as a member (pending status)
 * Requirements: 3.1, 3.5
 */
async function addMemberHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Add member
  const clubService = new ClubService();
  const membership = await clubService.addMember(clubId, authenticatedStudent.studentId);

  return successResponse(
    {
      studentId: membership.student_id,
      clubId: membership.club_id,
      status: membership.status,
      createdAt: membership.created_at,
    },
    201
  );
}

// Export with error handling middleware
export const GET = withErrorHandler(getMembersHandler);
export const POST = withErrorHandler(addMemberHandler);
