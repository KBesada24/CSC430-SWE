import { NextRequest } from 'next/server';
import { ClubService } from '@/lib/services/club.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireClubAdmin } from '@/lib/middleware/authorization.middleware';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';
import { updateClubSchema } from '@/lib/validators/club.validator';

/**
 * GET /api/clubs/[id]
 * Retrieves detailed club information
 * Requirements: 2.4
 */
async function getClubHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  const clubService = new ClubService();
  const club = await clubService.getById(clubId);

  return successResponse({
    clubId: club.club_id,
    name: club.name,
    description: club.description,
    category: club.category,
    coverPhotoUrl: club.cover_photo_url,
    adminStudentId: club.admin_student_id,
    createdAt: club.created_at,
    memberCount: club.member_count,
    nextEvent: club.next_event
      ? {
          eventId: club.next_event.event_id,
          title: club.next_event.title,
          eventDate: club.next_event.event_date,
          location: club.next_event.location,
        }
      : null,
  });
}

/**
 * PATCH /api/clubs/[id]
 * Updates club information (admin only)
 * Requirements: 4.2, 4.5
 */
async function updateClubHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student is club admin
  await requireClubAdmin(clubId, authenticatedStudent.studentId);

  // Validate request body
  const validatedData = await validateRequest(request, updateClubSchema);

  // Update club
  const clubService = new ClubService();
  const updatedClub = await clubService.update(clubId, validatedData);

  return successResponse({
    clubId: updatedClub.club_id,
    name: updatedClub.name,
    description: updatedClub.description,
    category: updatedClub.category,
    coverPhotoUrl: updatedClub.cover_photo_url,
    adminStudentId: updatedClub.admin_student_id,
    createdAt: updatedClub.created_at,
    memberCount: updatedClub.member_count,
    nextEvent: updatedClub.next_event
      ? {
          eventId: updatedClub.next_event.event_id,
          title: updatedClub.next_event.title,
          eventDate: updatedClub.next_event.event_date,
          location: updatedClub.next_event.location,
        }
      : null,
  });
}

/**
 * DELETE /api/clubs/[id]
 * Deletes a club (admin only)
 * Requirements: 4.5
 */
async function deleteClubHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const clubId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student is club admin
  await requireClubAdmin(clubId, authenticatedStudent.studentId);

  // Delete club
  const clubService = new ClubService();
  await clubService.delete(clubId);

  return successResponse({
    message: 'Club deleted successfully',
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getClubHandler);
export const PATCH = withErrorHandler(updateClubHandler);
export const DELETE = withErrorHandler(deleteClubHandler);
