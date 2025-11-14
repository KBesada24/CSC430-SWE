import { ClubService } from '@/lib/services/club.service';
import { AuthorizationError } from '@/lib/utils/error-handler';

/**
 * Verifies that a student is the admin of a specific club
 * 
 * @param clubId - The club ID to check admin status for
 * @param studentId - The student ID to verify
 * @throws AuthorizationError if student is not the club admin
 */
export async function requireClubAdmin(clubId: string, studentId: string): Promise<void> {
  const clubService = new ClubService();
  const isAdmin = await clubService.isAdmin(clubId, studentId);

  if (!isAdmin) {
    throw new AuthorizationError('You must be the club admin to perform this action');
  }
}

/**
 * Verifies that a student can only access/modify their own resources
 * 
 * @param requestedStudentId - The student ID being accessed
 * @param authenticatedStudentId - The authenticated student's ID
 * @throws AuthorizationError if IDs don't match
 */
export function requireSelfAccess(
  requestedStudentId: string,
  authenticatedStudentId: string
): void {
  if (requestedStudentId !== authenticatedStudentId) {
    throw new AuthorizationError('You can only access your own resources');
  }
}
