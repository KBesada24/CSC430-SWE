import { ReviewRepository } from '../repositories/review.repository';
import { ConflictError } from '@/lib/utils/error-handler';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async getClubReviews(clubId: string) {
    const reviews = await this.reviewRepository.findByClubId(clubId);
    
    return reviews.map(review => ({
      reviewId: review.review_id,
      rating: review.rating,
      comment: review.comment,
      clubId: review.club_id,
      studentId: review.student_id,
      createdAt: review.created_at,
      student: (review as any).student ? {
        studentId: (review as any).student.student_id,
        firstName: (review as any).student.first_name,
        lastName: (review as any).student.last_name,
      } : null
    }));
  }

  async createReview(clubId: string, studentId: string, rating: number, comment?: string) {
    // Check if already reviewed
    const hasReviewed = await this.reviewRepository.hasReviewed(clubId, studentId);
    if (hasReviewed) {
      throw new ConflictError('You have already reviewed this club');
    }

    const review = await this.reviewRepository.create({
      club_id: clubId,
      student_id: studentId,
      rating: rating,
      comment: comment || null,
    });

    return {
      reviewId: review.review_id,
      rating: review.rating,
      comment: review.comment,
      clubId: review.club_id,
      studentId: review.student_id,
      createdAt: review.created_at,
    };
  }
}
