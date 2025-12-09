
import { NextRequest, NextResponse } from 'next/server';
import { MessageService } from '@/lib/services/message.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import * as z from 'zod';

const messageService = new MessageService();

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(500, 'Message too long'),
});

// GET /api/clubs/[id]/messages
export const GET = withAuth(async (req, student, context: { params: { id: string } } | undefined) => {
  if (!context?.params?.id) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing club ID' } }, { status: 400 });
  }
  try {
    const clubId = context.params.id;
    // Potentially check if student is a member of the club
    const messages = await messageService.getClubMessages(clubId);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
});

// POST /api/clubs/[id]/messages
export const POST = withAuth(async (req, student, context: { params: { id: string } } | undefined) => {
  if (!context?.params?.id) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing club ID' } }, { status: 400 });
  }
  try {
    const body = await validateRequest(req, sendMessageSchema);
    const clubId = context.params.id;
    const studentId = student.studentId;
    
    // Potentially check if student is a member of the club before allowing send
    const message = await messageService.sendMessage(clubId, studentId, body.content);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
});
