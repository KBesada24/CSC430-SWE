# Frontend API Integration Design

## Overview

This document outlines the architecture and design for integrating the EagleConnect backend API with the React/Next.js frontend. The design follows modern React patterns with TypeScript, TanStack Query for server state management, and a clean separation of concerns.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  (Pages, Layouts, UI Components)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Custom Hooks Layer                          │
│  (useClubs, useEvents, useAuth, useStats)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              TanStack Query (React Query)                    │
│  (Caching, Refetching, Mutations, Optimistic Updates)       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   API Client Service                         │
│  (HTTP requests, Auth headers, Error handling)              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Backend REST API                            │
│  (Next.js API Routes)                                        │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── clubs/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── clubs/
│   │   ├── ClubCard.tsx
│   │   ├── ClubFilters.tsx
│   │   ├── ClubList.tsx
│   │   └── ClubDetails.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   └── EventDetails.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── ... (existing shadcn components)
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client configuration
│   │   ├── auth.ts            # Auth API calls
│   │   ├── clubs.ts           # Club API calls
│   │   ├── events.ts          # Event API calls
│   │   ├── students.ts        # Student API calls
│   │   └── stats.ts           # Stats API calls
│   ├── hooks/
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useClubs.ts        # Clubs data hook
│   │   ├── useEvents.ts       # Events data hook
│   │   ├── useStats.ts        # Statistics hook
│   │   └── useStudent.ts      # Student profile hook
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth context provider
│   └── utils/
│       ├── auth.ts            # Auth utilities
│       └── storage.ts         # Local storage utilities
└── types/
    └── api.types.ts           # API type definitions (from backend)
```

## Core Components

### 1. API Client (`lib/api/client.ts`)

```typescript
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

class ApiClient {
  private config: ApiClientConfig;
  
  constructor(config: ApiClientConfig);
  
  // HTTP methods
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  
  // Interceptors
  setAuthToken(token: string): void;
  clearAuthToken(): void;
}
```

**Features:**
- Automatic auth token injection
- Request/response interceptors
- Error handling and transformation
- TypeScript generics for type safety
- Retry logic for failed requests

### 2. Authentication Context (`lib/contexts/AuthContext.tsx`)

```typescript
interface AuthContextValue {
  user: StudentProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateStudentDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Implementation
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Features:**
- Manages authentication state
- Persists token in localStorage/cookies
- Provides login/register/logout functions
- Auto-refreshes user data
- Handles token expiration

### 3. Data Fetching Hooks

#### useClubs Hook

```typescript
interface UseClubsOptions {
  filters?: ClubFilters;
  pagination?: Pagination;
  enabled?: boolean;
}

interface UseClubsReturn {
  clubs: ClubListItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: PaginationMeta;
  refetch: () => void;
}

export function useClubs(options?: UseClubsOptions): UseClubsReturn;

export function useClub(id: string): {
  club: ClubDetails | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useJoinClub(): {
  joinClub: (clubId: string) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
};

export function useLeaveClub(): {
  leaveClub: (clubId: string) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
};
```

#### useEvents Hook

```typescript
interface UseEventsOptions {
  filters?: EventFilters;
  pagination?: Pagination;
  enabled?: boolean;
}

export function useEvents(options?: UseEventsOptions): {
  events: EventListItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: PaginationMeta;
};

export function useEvent(id: string): {
  event: EventDetails | null;
  isLoading: boolean;
  isError: boolean;
};

export function useRsvpEvent(): {
  rsvp: (eventId: string) => Promise<void>;
  cancelRsvp: (eventId: string) => Promise<void>;
  isLoading: boolean;
};
```

#### useStats Hook

```typescript
export function usePlatformStats(): {
  stats: PlatformStats | null;
  isLoading: boolean;
  isError: boolean;
};

export function useStudentStats(studentId: string): {
  stats: StudentStats | null;
  isLoading: boolean;
  isError: boolean;
};
```

### 4. TanStack Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Query keys
export const queryKeys = {
  clubs: {
    all: ['clubs'] as const,
    lists: () => [...queryKeys.clubs.all, 'list'] as const,
    list: (filters: ClubFilters) => [...queryKeys.clubs.lists(), filters] as const,
    details: () => [...queryKeys.clubs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clubs.details(), id] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: EventFilters) => [...queryKeys.events.lists(), filters] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
  },
  stats: {
    platform: ['stats', 'platform'] as const,
    student: (id: string) => ['stats', 'student', id] as const,
  },
};
```

## Component Updates

### Updated Home Page

```typescript
export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { clubs, isLoading: clubsLoading } = useClubs({ 
    pagination: { page: 1, limit: 6 } 
  });
  const { events, isLoading: eventsLoading } = useEvents({ 
    filters: { upcoming: true },
    pagination: { page: 1, limit: 3 }
  });
  const { stats: platformStats } = usePlatformStats();
  const { stats: studentStats } = useStudentStats(user?.studentId || '');

  if (clubsLoading || eventsLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <Header />
      <StatsSection 
        platformStats={platformStats} 
        studentStats={studentStats} 
      />
      <ClubsSection clubs={clubs} />
      <EventsSection events={events} />
    </div>
  );
}
```

### Updated ClubCard

```typescript
export default function ClubCard({ club }: { club: ClubListItem }) {
  const { user, isAuthenticated } = useAuth();
  const { joinClub, isLoading } = useJoinClub();
  const { data: memberships } = useStudentMemberships(user?.studentId);
  
  const isJoined = memberships?.some(m => m.clubId === club.clubId);

  const handleJoinClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await joinClub(club.clubId);
    toast.success('Successfully joined club!');
  };

  return (
    <Card>
      {/* ... */}
      <Button 
        onClick={handleJoinClick}
        disabled={isLoading}
      >
        {isJoined ? 'View Club' : 'Join Club'}
      </Button>
    </Card>
  );
}
```

### Updated EventCard

```typescript
export default function EventCard({ event }: { event: EventListItem }) {
  const { user, isAuthenticated } = useAuth();
  const { rsvp, cancelRsvp, isLoading } = useRsvpEvent();
  const { data: rsvps } = useEventRsvps(event.eventId);
  
  const isRsvped = rsvps?.some(r => r.studentId === user?.studentId);

  const handleRsvpClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isRsvped) {
      await cancelRsvp(event.eventId);
      toast.success('RSVP canceled');
    } else {
      await rsvp(event.eventId);
      toast.success('Successfully RSVP\'d!');
    }
  };

  return (
    <Card>
      {/* ... */}
      <Button 
        onClick={handleRsvpClick}
        disabled={isLoading}
      >
        {isRsvped ? 'Cancel RSVP' : 'RSVP'}
      </Button>
    </Card>
  );
}
```

## Authentication Flow

### Login Flow

```
1. User enters credentials
2. Frontend validates input
3. Call POST /api/auth/login
4. Receive JWT token and user data
5. Store token in localStorage/cookie
6. Update AuthContext state
7. Redirect to dashboard
```

### Protected Routes

```typescript
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## Error Handling

### Error Types

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Error handler
function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  
  if (error instanceof Response) {
    // Handle HTTP errors
  }
  
  return new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
}
```

### Error Display

```typescript
export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

## Loading States

### Skeleton Components

```typescript
export function ClubCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function ClubListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ClubCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

## Optimistic Updates

```typescript
export function useJoinClub() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clubId: string) => clubsApi.joinClub(clubId),
    onMutate: async (clubId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.clubs.detail(clubId) });
      
      // Snapshot previous value
      const previousClub = queryClient.getQueryData(queryKeys.clubs.detail(clubId));
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.clubs.detail(clubId), (old: ClubDetails) => ({
        ...old,
        memberCount: old.memberCount + 1,
      }));
      
      return { previousClub };
    },
    onError: (err, clubId, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.clubs.detail(clubId), context?.previousClub);
    },
    onSettled: (data, error, clubId) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.detail(clubId) });
    },
  });
}
```

## Performance Optimizations

1. **Data Prefetching**: Prefetch club/event details on hover
2. **Pagination**: Implement cursor-based pagination for infinite scroll
3. **Debouncing**: Debounce search inputs to reduce API calls
4. **Memoization**: Use React.memo for expensive components
5. **Code Splitting**: Lazy load routes and heavy components

## Security Considerations

1. **Token Storage**: Use httpOnly cookies for production
2. **CSRF Protection**: Implement CSRF tokens for mutations
3. **Input Validation**: Validate all inputs with Zod before API calls
4. **XSS Prevention**: Sanitize user-generated content
5. **Rate Limiting**: Implement client-side rate limiting for API calls

## Testing Strategy

1. **Unit Tests**: Test hooks and API client functions
2. **Integration Tests**: Test component interactions with API
3. **E2E Tests**: Test complete user flows (login, join club, RSVP)
4. **Mock API**: Use MSW (Mock Service Worker) for testing
