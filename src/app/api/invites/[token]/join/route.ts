import { NextRequest } from 'next/server';
import { InviteService } from '@/lib/services/invite.service';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { NotFoundError, ConflictError } from '@/lib/utils/error-handler';

/**
 * POST /api/invites/[token]/join
 * Join a club using an invite token
 * Requirements: 3.1, 3.3, 3.4, 3.5
 */
async function joinViaInviteHandler(
  request: NextRequest,
  context?: { params: { token: string } }
) {
  const token = context!.params.token;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Get club ID from token
  const inviteService = new InviteService();
  const clubId = await inviteService.getClubIdFromToken(token);

  if (!clubId) {
    throw new NotFoundError('Invite token is invalid or has expired');
  }

  // Check if student is already a member
  const clubService = new ClubService();
  const members = await clubService.getMembers(clubId);
  const existingMembership = members.find(
    (m) => m.student_id === authenticatedStudent.studentId
  );

  if (existingMembership) {
    throw new ConflictError("You're already a member of this club");
  }

  // Add student to club with active status
  const membership = await clubService.addMember(clubId, authenticatedStudent.studentId);
  
  // Update status to active (since invite links bypass approval)
  const activeMembership = await clubService.updateMemberStatus(
    clubId,
    authenticatedStudent.studentId,
    'active'
  );

  return successResponse({
    clubId,
    membership: {
      studentId: activeMembership.student_id,
      clubId: activeMembership.club_id,
      status: activeMembership.status,
      createdAt: activeMembership.created_at,
    },
  });
}

// Export with error handling middleware
export const POST = withErrorHandler(joinViaInviteHandler);
