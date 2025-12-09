
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export const chatKeys = {
  all: ['chat'] as const,
  messages: (clubId: string) => [...chatKeys.all, 'messages', clubId] as const,
};

export interface ChatMessage {
  messageId: string;
  content: string;
  clubId: string;
  studentId: string;
  createdAt: string;
  student?: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export function useChatMessages(clubId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`club_chat:${clubId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `club_id=eq.${clubId}`,
        },
        async (payload) => {
          // Invalidate query to refetch latest messages including student info
          // Optimization: could optimistically add message if we had student info,
          // but refetch is safer for now to get the join.
          await queryClient.invalidateQueries({ queryKey: chatKeys.messages(clubId) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clubId, queryClient, supabase]);

  return useQuery({
    queryKey: chatKeys.messages(clubId),
    queryFn: async () => {
      const response = await apiClient.get<{ data: ChatMessage[] }>(`/clubs/${clubId}/messages`);
      return response.data;
    },
  });
}

export function useSendMessage(clubId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      return apiClient.post(`/clubs/${clubId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(clubId) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}
