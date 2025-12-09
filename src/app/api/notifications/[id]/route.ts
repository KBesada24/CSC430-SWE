import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/services/notification.service';
import { withAuth } from '@/lib/middleware/auth.middleware';

const notificationService = new NotificationService();

export const PATCH = withAuth(async (req, student, context: { params: { id: string } } | undefined) => {
  if (!context?.params?.id) {
     return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing notification ID' } }, { status: 400 });
  }
  try {
    await notificationService.markAsRead(context.params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
});
