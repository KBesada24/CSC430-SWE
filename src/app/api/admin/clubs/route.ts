import { NextRequest } from 'next/server';
import { AdminService } from '@/lib/services/admin.service';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { StudentRepository } from '@/lib/repositories/student.repository';

/**
 * GET /api/admin/clubs
 * List clubs for admin review
 * Query params: status=pending|approved (default: pending)
 * Requires university_admin role
 */
async function getClubsHandler(request: NextRequest & { studentId?: string }) {
  const studentId = request.studentId;
  
  if (!studentId) {
    return errorResponse('AUTHENTICATION_ERROR', 'Authentication required', 401);
  }

  // Check admin access
  const studentRepository = new StudentRepository();
  const isAdmin = await studentRepository.isUniversityAdmin(studentId);
  
  if (!isAdmin) {
    return errorResponse('AUTHORIZATION_ERROR', 'Admin access required', 403);
  }

  // Check for status query parameter
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const validStatuses = ['pending', 'approved'];
  if (!validStatuses.includes(status)) {
    return errorResponse('VALIDATION_ERROR', 'Invalid status. Must be "pending" or "approved"', 400);
  }

  const adminService = new AdminService();
  
  if (status === 'approved') {
    const activeClubs = await adminService.getActiveClubs();
    return successResponse({ clubs: activeClubs });
  } else {
    const pendingClubs = await adminService.getPendingClubs();
    return successResponse({ clubs: pendingClubs });
  }
}

// Export with error handling and auth middleware
export const GET = withErrorHandler(withAuth(getClubsHandler));
