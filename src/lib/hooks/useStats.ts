import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats';

// Query keys
export const statsKeys = {
  platform: ['stats', 'platform'] as const,
  student: (id: string) => ['stats', 'student', id] as const,
};

// Fetch platform statistics
export function usePlatformStats() {
  return useQuery({
    queryKey: statsKeys.platform,
    queryFn: () => statsApi.getPlatformStats(),
  });
}

// Fetch student statistics
export function useStudentStats(studentId: string) {
  return useQuery({
    queryKey: statsKeys.student(studentId),
    queryFn: () => statsApi.getStudentStats(studentId),
    enabled: !!studentId,
  });
}
