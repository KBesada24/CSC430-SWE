import { NextRequest } from 'next/server';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireClubAdmin } from '@/lib/middleware/authorization.middleware';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { updateMembershipStatusSchema } from '@/lib/validators/club.validator';
import { AuthorizationError } from '@/lib/utils/error-handler';

/**
 * PATCH /api/clubs/[id]/members/[studentId]
 * Updates membership status (admin only)
 * Requirements: 3.2, 4.4
 */
async function updateMemberStatusHandler(
  request: NextRequest,
  context?: { params: { id: string; studentId: string } }
) {
  const clubId = context!.params.id;
  const studentId = context!.params.studentId;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student is club admin
  await requireClubAdmin(clubId, authenticatedStudent.studentId);

  // Validate request body
  const validatedData = await validateRequest(request, updateMembershipStatusSchema);

  // Update membership status
  const clubService = new ClubService();
  const membership = await clubService.updateMemberStatus(
    clubId,
    studentId,
    validatedData.status
  );

  return successResponse({
    studentId: membership.student_id,
    clubId: membership.club_id,
    status: membership.status,
    createdAt: membership.created_at,
  });
}

/**
 * DELETE /api/clubs/[id]/members/[studentId]
 * Removes a member from the club
 * Requirements: 3.3
 */
async function removeMemberHandler(
  request: NextRequest,
  context?: { params: { id: string; studentId: string } }
) {
  const clubId = context!.params.id;
  const studentId = context!.params.studentId;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student is either the member themselves or the club admin
  const clubService = new ClubService();
  const isAdmin = await clubService.isAdmin(clubId, authenticatedStudent.studentId);
  const isSelf = authenticatedStudent.studentId === studentId;

  if (!isAdmin && !isSelf) {
    throw new AuthorizationError('You can only remove yourself or be an admin to remove members');
  }

  // Remove member
  await clubService.removeMember(clubId, studentId);

  return successResponse({
    message: 'Member removed successfully',
  });
}

// Export with error handling middleware
export const PATCH = withErrorHandler(updateMemberStatusHandler);
export const DELETE = withErrorHandler(removeMemberHandler);
