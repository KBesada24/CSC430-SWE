import { NextRequest } from 'next/server';
import { InviteService } from '@/lib/services/invite.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireClubAdmin } from '@/lib/middleware/authorization.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/clubs/[id]/invite
 * Get or generate invite link for a club (admin only)
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
async function getInviteHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student is club admin
  await requireClubAdmin(clubId, authenticatedStudent.studentId);

  // Get or create invite
  const inviteService = new InviteService();
  const invite = await inviteService.getOrCreateInvite(clubId);

  return successResponse({
    inviteUrl: invite.inviteUrl,
    token: invite.token,
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getInviteHandler);
