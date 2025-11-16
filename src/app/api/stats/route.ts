import { NextRequest } from 'next/server';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { MembershipRepository } from '@/lib/repositories/membership.repository';
import { EventRepository } from '@/lib/repositories/event.repository';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/stats
 * Retrieves platform-wide statistics
 * Requirements: 7.1, 7.2, 7.3
 */
async function getStatsHandler(request: NextRequest) {
  const clubRepository = new ClubRepository();
  const membershipRepository = new MembershipRepository();
  const eventRepository = new EventRepository();

  // Get total club count
  const { total: totalClubs } = await clubRepository.findAll({}, { page: 1, limit: 1 });

  // Get total active membership count by summing member counts from all clubs
  const allClubs = await clubRepository.findAll({}, { page: 1, limit: 1000 });
  let totalMembers = 0;
  for (const club of allClubs.clubs) {
    const count = await clubRepository.getMemberCount(club.club_id);
    totalMembers += count;
  }

  // Get upcoming events count (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const upcomingEvents = await eventRepository.findAll(
    { upcoming: true },
    { page: 1, limit: 1000 }
  );
  
  // Filter events within next 30 days
  const eventsInNext30Days = upcomingEvents.events.filter((event) => {
    const eventDate = new Date(event.event_date);
    return eventDate <= thirtyDaysFromNow;
  });

  return successResponse({
    totalClubs,
    totalMembers,
    upcomingEvents: eventsInNext30Days.length,
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getStatsHandler);
