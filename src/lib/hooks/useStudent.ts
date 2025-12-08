import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

// Query keys
export const studentKeys = {
  all: ['students'] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  memberships: (id: string) => [...studentKeys.detail(id), 'memberships'] as const,
};

// Fetch student profile
export function useStudentProfile(studentId: string) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => studentsApi.getStudent(studentId),
    enabled: !!studentId && !authLoading && isAuthenticated,
  });
}

// Fetch student memberships
export function useStudentMemberships(studentId: string) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: studentKeys.memberships(studentId),
    queryFn: () => studentsApi.getMemberships(studentId),
    enabled: !!studentId && !authLoading && isAuthenticated,
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      studentsApi.updateStudent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}
