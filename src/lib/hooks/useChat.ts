
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { toast } from 'sonner';

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
  return useQuery({
    queryKey: chatKeys.messages(clubId),
    queryFn: async () => {
      // apiClient.get returns the data payload directly (unwrapped from ApiResponse)
      const messages = await apiClient.get<ChatMessage[]>(`/clubs/${clubId}/messages`);
      return messages;
    },
    // Poll for new messages every 2 seconds for real-time feel
    refetchInterval: 2000,
    // Keep refetching even when tab is not focused
    refetchIntervalInBackground: true,
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
