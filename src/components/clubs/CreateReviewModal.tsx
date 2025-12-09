'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function CreateReviewModal({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(clubId);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>();

  const onSubmit = (data: ReviewFormData) => {
    if (rating === 0) return;
    
    createReview(
      { rating, comment: data.comment },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          setRating(0);
        },
      }
    );
  };

  const handleStarClick = (score: number) => {
    setRating(score);
    setValue('rating', score);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this club.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`focus:outline-none ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you think..."
              rows={4}
              {...register('comment')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || rating === 0}>
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
