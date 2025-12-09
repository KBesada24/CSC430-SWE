
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/services/notification.service';
import { withAuth } from '@/lib/middleware/auth.middleware';

const notificationService = new NotificationService();

// GET /api/notifications
export const GET = withAuth(async (req, student, context) => {
  try {
    const notifications = await notificationService.getUserNotifications(student.studentId);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
});

// PATCH /api/notifications/[id] - Mark as read
// Since withAuth is flexible, we can rely on path params being extracted if we define route file properly.
// But this file handles /api/notifications, so no [id].
// We should probably allow marking specific notification as read via PATCH body or query param
// OR create /api/notifications/[id]/route.ts
// Let's create `api/notifications/[id]/route.ts` next.
// But wait, user asked for "notifications system".
// I will just put GET here.
