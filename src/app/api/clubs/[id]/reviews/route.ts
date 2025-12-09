
import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/lib/services/review.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { validateRequest } from '@/lib/middleware/validation.middleware';
import * as z from 'zod';

const reviewService = new ReviewService();

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// GET /api/clubs/[id]/reviews
export const GET = withAuth(async (req, student, context: { params: { id: string } } | undefined) => {
  if (!context?.params?.id) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing club ID' } }, { status: 400 });
  }
  try {
    const clubId = context.params.id;
    const reviews = await reviewService.getClubReviews(clubId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }
});

// POST /api/clubs/[id]/reviews
export const POST = withAuth(async (req, student, context: { params: { id: string } } | undefined) => {
  if (!context?.params?.id) {
    return NextResponse.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing club ID' } }, { status: 400 });
  }
  try {
    const body = await validateRequest(req, createReviewSchema);
    const clubId = context.params.id;
    const studentId = student.studentId;
    
    const review = await reviewService.createReview(clubId, studentId, body.rating, body.comment);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    const code = error.name === 'ConflictError' ? 'CONFLICT' : 'INTERNAL_ERROR';
    const status = error.name === 'ConflictError' ? 409 : 500;
    
    return NextResponse.json(
      { success: false, error: { code: code, message: error.message } },
      { status: status }
    );
  }
});
