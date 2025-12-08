import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { StudentRepository } from '@/lib/repositories/student.repository';
import { JwtPayload } from '@/lib/utils/jwt';

/**
 * PATCH /api/admin/clubs/[id]
 * Approve, reject, or deactivate a club
 * Request body: { action: 'approve' | 'reject' | 'deactivate', reason?: string }
 * Requires university_admin role
 */
async function updateClubStatusHandler(
  request: NextRequest,
  student: JwtPayload,
  context?: { params: { id: string } }
) {
  const studentId = student.studentId;
  const clubId = context?.params?.id;
  
  if (!studentId) {
    return errorResponse('AUTHENTICATION_ERROR', 'Authentication required', 401);
  }

  if (!clubId) {
    return errorResponse('VALIDATION_ERROR', 'Club ID is required', 400);
  }

  // Check admin access
  const studentRepository = new StudentRepository();
  const isAdmin = await studentRepository.isUniversityAdmin(studentId);
  
  if (!isAdmin) {
    return errorResponse('AUTHORIZATION_ERROR', 'Admin access required', 403);
  }

  // Parse request body
  const body = await request.json();
  const { action, reason } = body as { action: 'approve' | 'reject' | 'deactivate'; reason?: string };

  if (!action || !['approve', 'reject', 'deactivate'].includes(action)) {
    return errorResponse('VALIDATION_ERROR', 'Invalid action. Must be "approve", "reject", or "deactivate"', 400);
  }

  if (action === 'reject' && !reason) {
    return errorResponse('VALIDATION_ERROR', 'Reason is required when rejecting a club', 400);
  }

  const adminService = new AdminService();

  if (action === 'approve') {
    await adminService.approveClub(clubId, studentId);
    return successResponse({ message: 'Club approved successfully' });
  } else if (action === 'reject') {
    await adminService.rejectClub(clubId, studentId, reason!);
    return successResponse({ message: 'Club rejected successfully' });
  } else {
    await adminService.deactivateClub(clubId, studentId);
    return successResponse({ message: 'Club deactivated successfully' });
  }
}

// Export with error handling and auth middleware
export const PATCH = withErrorHandler(withAuth(updateClubStatusHandler));
