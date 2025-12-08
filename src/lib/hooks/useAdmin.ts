/**
 * Admin Hooks
 * React Query hooks for admin operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

// Types
interface PendingClub {
  clubId: string;
  name: string;
  description: string | null;
  category: string;
  coverPhotoUrl: string | null;
  adminStudentId: string | null;
  createdAt: string | null;
  adminName?: string;
  adminEmail?: string;
}

// Query keys
export const adminKeys = {
  pendingClubs: ['admin', 'pending-clubs'] as const,
  activeClubs: ['admin', 'active-clubs'] as const,
};

// API functions
const adminApi = {
  getPendingClubs: async (): Promise<PendingClub[]> => {
    const response = await apiClient.get<{ clubs: PendingClub[] }>('/admin/clubs');
    return response.clubs;
  },
  
  getActiveClubs: async (): Promise<PendingClub[]> => {
    const response = await apiClient.get<{ clubs: PendingClub[] }>('/admin/clubs?status=approved');
    return response.clubs;
  },
  
  approveClub: async (clubId: string): Promise<{ message: string }> => {
    return apiClient.patch(`/admin/clubs/${clubId}`, { action: 'approve' });
  },
  
  rejectClub: async (clubId: string, reason: string): Promise<{ message: string }> => {
    return apiClient.patch(`/admin/clubs/${clubId}`, { action: 'reject', reason });
  },
  
  deactivateClub: async (clubId: string): Promise<{ message: string }> => {
    return apiClient.patch(`/admin/clubs/${clubId}`, { action: 'deactivate' });
  },
};

// Hooks

/**
 * Fetch pending clubs for admin review
 */
export function usePendingClubs() {
  return useQuery({
    queryKey: adminKeys.pendingClubs,
    queryFn: adminApi.getPendingClubs,
  });
}

/**
 * Fetch active/approved clubs
 */
export function useActiveClubs() {
  return useQuery({
    queryKey: adminKeys.activeClubs,
    queryFn: adminApi.getActiveClubs,
  });
}

/**
 * Approve a club
 */
export function useApproveClub() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clubId: string) => adminApi.approveClub(clubId),
    onSuccess: () => {
      // Invalidate pending clubs list after approval
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingClubs });
      queryClient.invalidateQueries({ queryKey: adminKeys.activeClubs });
    },
  });
}

/**
 * Reject a club
 */
export function useRejectClub() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ clubId, reason }: { clubId: string; reason: string }) => 
      adminApi.rejectClub(clubId, reason),
    onSuccess: () => {
      // Invalidate pending clubs list after rejection
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingClubs });
    },
  });
}

/**
 * Deactivate a club
 */
export function useDeactivateClub() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clubId: string) => adminApi.deactivateClub(clubId),
    onSuccess: () => {
      // Invalidate active clubs list after deactivation
      queryClient.invalidateQueries({ queryKey: adminKeys.activeClubs });
    },
  });
}

