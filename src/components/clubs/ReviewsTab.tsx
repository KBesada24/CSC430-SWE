'use client';

import { useReviews } from '@/lib/hooks/useReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import CreateReviewModal from './CreateReviewModal';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ReviewsTab({ clubId }: { clubId: string }) {
  const { data: reviews, isLoading } = useReviews(clubId);
  const { user } = useAuth();

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Club Reviews</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
             <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
             <span className="font-bold text-foreground">{averageRating}</span>
             <span>({reviews?.length || 0} reviews)</span>
          </div>
        </div>
        {user && <CreateReviewModal clubId={clubId} />}
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading reviews...</div>
        ) : !reviews || reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.reviewId}>
              <CardHeader className="flex flex-row items-center gap-4 py-4">
                <Avatar>
                  <AvatarFallback>
                    {review.student ? `${review.student.firstName[0]}${review.student.lastName[0]}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {review.student ? `${review.student.firstName} ${review.student.lastName}` : 'Unknown Student'}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
