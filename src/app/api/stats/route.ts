import { NextRequest } from 'next/server';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { MembershipRepository } from '@/lib/repositories/membership.repository';
import { EventRepository } from '@/lib/repositories/event.repository';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/stats
 * Retrieves platform-wide statistics with trend data
 * Requirements: 7.1, 7.2, 7.3
 */
async function getStatsHandler(request: NextRequest) {
  const clubRepository = new ClubRepository();
  const membershipRepository = new MembershipRepository();
  const eventRepository = new EventRepository();

  // Calculate date 30 days ago for trend comparison
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get total club count (using limit 1 for efficiency as we only need the count)
  const { total: totalClubs } = await clubRepository.findAll({}, { page: 1, limit: 1 });

  // Calculate clubs created in the last 30 days for trend
  const clubsCreatedRecently = await clubRepository.countCreatedAfter(thirtyDaysAgo);

  // Get total active membership count in a single query (optimized from iterating clubs)
  const totalMembers = await membershipRepository.countAllActiveMembers();

  // Estimate membership trend (new memberships in last 30 days)
  const membershipsCreatedRecently = await membershipRepository.countRecentMemberships(thirtyDaysAgo);

  // Get upcoming events count (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  // Count upcoming events within next 30 days
  const upcomingEventsCount = await eventRepository.countUpcoming(thirtyDaysFromNow);

  // Calculate events created in the last 30 days for trend
  const eventsCreatedRecently = await eventRepository.countCreatedAfter(thirtyDaysAgo);

  return successResponse({
    totalClubs,
    totalMembers,
    upcomingEvents: upcomingEventsCount,
    trends: {
      clubsChange: clubsCreatedRecently,
      membersChange: membershipsCreatedRecently,
      eventsChange: eventsCreatedRecently,
    },
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getStatsHandler);
