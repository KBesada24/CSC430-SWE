
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { toast } from 'sonner';

export const reviewKeys = {
  all: ['reviews'] as const,
  list: (clubId: string) => [...reviewKeys.all, 'list', clubId] as const,
};

export interface Review {
  reviewId: string;
  rating: number;
  comment: string | null;
  clubId: string;
  studentId: string;
  createdAt: string;
  student?: {
    studentId: string;
    firstName: string;
    lastName: string;
  };
}

export function useReviews(clubId: string) {
  return useQuery({
    queryKey: reviewKeys.list(clubId),
    queryFn: async () => {
      // apiClient.get returns the data payload directly (unwrapped from ApiResponse)
      const reviews = await apiClient.get<Review[]>(`/clubs/${clubId}/reviews`);
      return reviews;
    },
  });
}

export function useCreateReview(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { rating: number; comment?: string }) => {
      return apiClient.post(`/clubs/${clubId}/reviews`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(clubId) });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });
}
