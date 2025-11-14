import { NextRequest } from 'next/server';
import { MembershipRepository } from '@/lib/repositories/membership.repository';
import { RsvpRepository } from '@/lib/repositories/rsvp.repository';
import { EventRepository } from '@/lib/repositories/event.repository';
import { authenticateRequest } from '@/lib/middleware/auth.middleware';
import { requireSelfAccess } from '@/lib/middleware/authorization.middleware';
import { withErrorHandler } from '@/lib/middleware/error.middleware';
import { successResponse } from '@/lib/utils/api-response';

/**
 * GET /api/stats/student/[id]
 * Retrieves personal statistics for a student
 * Requirements: 7.4, 7.5
 */
async function getStudentStatsHandler(
  request: NextRequest,
  context?: { params: { id: string } }
) {
  const studentId = context!.params.id;

  // Authenticate request
  const authenticatedStudent = authenticateRequest(request);

  // Verify student can only access their own stats
  requireSelfAccess(studentId, authenticatedStudent.studentId);

  const membershipRepository = new MembershipRepository();
  const rsvpRepository = new RsvpRepository();
  const eventRepository = new EventRepository();

  // Get student's active membership count
  const memberships = await membershipRepository.findByStudent(studentId);
  const activeMemberships = memberships.filter((m) => m.status === 'active');

  // Get student's upcoming RSVP count
  const rsvps = await rsvpRepository.findByStudent(studentId);
  
  // Filter for upcoming events
  let upcomingEventCount = 0;
  for (const rsvp of rsvps) {
    const event = await eventRepository.findById(rsvp.event_id);
    if (event && new Date(event.event_date) > new Date()) {
      upcomingEventCount++;
    }
  }

  return successResponse({
    clubCount: activeMemberships.length,
    upcomingEventCount,
  });
}

// Export with error handling middleware
export const GET = withErrorHandler(getStudentStatsHandler);
