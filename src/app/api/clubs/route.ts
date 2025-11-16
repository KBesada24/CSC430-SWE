import { NextRequest } from 'next/server';
import { ClubService } from '@/lib/services/club.service';
import { InviteService } from '@/lib/services/invite.service';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { validateQueryParams, validateRequest } from '@/lib/middleware/validation.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse, paginatedResponse } from '@/lib/utils/api-response';
import { clubFiltersSchema, createClubSchema } from '@/lib/validators/club.validator';

/**
 * GET /api/clubs
 * Retrieves paginated list of clubs with filters
 * Requirements: 2.1, 2.2, 2.3, 2.5, 9.3
 */
async function getClubsHandler(request: NextRequest) {
  // Parse and validate query parameters
  const queryParams = validateQueryParams(request, clubFiltersSchema);

  const clubService = new ClubService();
  const result = await clubService.getAll(
    {
      category: queryParams.category,
      search: queryParams.search,
    },
    {
      page: queryParams.page,
      limit: queryParams.limit,
    }
  );

  return paginatedResponse(
    result.items.map((club) => ({
      clubId: club.club_id,
      name: club.name,
      description: club.description,
      category: club.category,
      coverPhotoUrl: club.cover_photo_url,
      adminStudentId: club.admin_student_id,
      createdAt: club.created_at,
      memberCount: club.member_count,
    })),
    result.pagination.total,
    result.pagination.page,
    result.pagination.limit
  );
}

/**
 * POST /api/clubs
 * Creates a new club with authenticated student as admin
 * Requirements: 1.2, 2.2, 2.5, 4.1
 */
async function createClubHandler(request: NextRequest) {
  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Validate request body
  const validatedData = await validateRequest(request, createClubSchema);

  // Create club
  const clubService = new ClubService();
  const club = await clubService.create(validatedData, authenticatedStudent.studentId);

  // Generate invite token for the new club
  const inviteService = new InviteService();
  const invite = await inviteService.getOrCreateInvite(club.club_id);

  return successResponse(
    {
      clubId: club.club_id,
      name: club.name,
      description: club.description,
      category: club.category,
      coverPhotoUrl: club.cover_photo_url,
      adminStudentId: club.admin_student_id,
      createdAt: club.created_at,
      memberCount: club.member_count,
      nextEvent: club.next_event,
      inviteToken: invite.token,
    },
    201
  );
}

// Export with error handling middleware
export const GET = withErrorHandler(getClubsHandler);
export const POST = withErrorHandler(createClubHandler);
