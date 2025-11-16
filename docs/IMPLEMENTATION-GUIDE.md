# Frontend API Integration - Implementation Guide

## ✅ Completed Infrastructure (Tasks 1-3)

The following critical infrastructure has been implemented and tested:

### 1. Dependencies Installed
- ✅ TanStack Query (React Query) for data fetching
- ✅ React Hook Form + Zod for forms
- ✅ Sonner for toast notifications
- ✅ date-fns for date formatting

### 2. API Client (`src/lib/api/`)
- ✅ `client.ts` - Base HTTP client with error handling
- ✅ `auth.ts` - Authentication API calls
- ✅ `clubs.ts` - Club API calls
- ✅ `events.ts` - Event API calls
- ✅ `students.ts` - Student API calls
- ✅ `stats.ts` - Statistics API calls

### 3. Authentication System
- ✅ `AuthContext.tsx` - Auth state management
- ✅ `useAuth()` hook - Access auth state
- ✅ `storage.ts` - LocalStorage utilities
- ✅ `auth.ts` - Auth helper functions
- ✅ `QueryProvider.tsx` - React Query setup
- ✅ Layout updated with providers

## 📋 Remaining Tasks - Implementation Templates

### Phase 2: Authentication Pages (Tasks 4-5)

#### Task 4.1: Create Login Page

**File:** `src/app/(auth)/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to your EagleConnect account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Task 4.2: Create Register Page

**File:** `src/app/(auth)/register/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join EagleConnect today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Task 5.1: Update Header with Auth

**Update:** `src/components/layout/Header.tsx`

Add this to the top of the file:
```typescript
'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
```

Replace the user dropdown section with:
```typescript
const { user, isAuthenticated, logout } = useAuth();
const router = useRouter();

// In the dropdown menu:
{isAuthenticated ? (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        {user?.firstName} {user?.lastName}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.push('/profile')}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem>My Clubs</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  <div className="flex gap-2">
    <Button variant="ghost" onClick={() => router.push('/login')}>
      Login
    </Button>
    <Button onClick={() => router.push('/register')}>
      Register
    </Button>
  </div>
)}
```

### Phase 3: Data Fetching Hooks (Tasks 6-9)

#### Task 6.1: Create useClubs Hook

**File:** `src/lib/hooks/useClubs.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsApi } from '../api/clubs';
import { ClubFilters, Pagination } from '@/types/api.types';
import { toast } from 'sonner';

// Query keys
export const clubKeys = {
  all: ['clubs'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (filters?: ClubFilters, pagination?: Pagination) => 
    [...clubKeys.lists(), { filters, pagination }] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: string) => [...clubKeys.details(), id] as const,
  members: (id: string) => [...clubKeys.detail(id), 'members'] as const,
};

// Fetch clubs with filters
export function useClubs(filters?: ClubFilters, pagination?: Pagination) {
  return useQuery({
    queryKey: clubKeys.list(filters, pagination),
    queryFn: () => clubsApi.getClubs(filters, pagination),
  });
}

// Fetch single club
export function useClub(id: string) {
  return useQuery({
    queryKey: clubKeys.detail(id),
    queryFn: () => clubsApi.getClub(id),
    enabled: !!id,
  });
}

// Join club mutation
export function useJoinClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: string) => clubsApi.joinClub(clubId),
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() });
      toast.success('Successfully joined club!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to join club');
    },
  });
}

// Leave club mutation
export function useLeaveClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, studentId }: { clubId: string; studentId: string }) =>
      clubsApi.leaveClub(clubId, studentId),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
      queryClient.invalidateQueries({ queryKey: clubKeys.lists() });
      toast.success('Left club successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to leave club');
    },
  });
}
```

#### Task 7.1: Create useEvents Hook

**File:** `src/lib/hooks/useEvents.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/events';
import { EventFilters, Pagination } from '@/types/api.types';
import { toast } from 'sonner';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: EventFilters, pagination?: Pagination) =>
    [...eventKeys.lists(), { filters, pagination }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  attendees: (id: string) => [...eventKeys.detail(id), 'attendees'] as const,
};

// Fetch events with filters
export function useEvents(filters?: EventFilters, pagination?: Pagination) {
  return useQuery({
    queryKey: eventKeys.list(filters, pagination),
    queryFn: () => eventsApi.getEvents(filters, pagination),
  });
}

// Fetch single event
export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id,
  });
}

// RSVP to event mutation
export function useRsvpEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.rsvpEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('RSVP successful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to RSVP');
    },
  });
}

// Cancel RSVP mutation
export function useCancelRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, studentId }: { eventId: string; studentId: string }) =>
      eventsApi.cancelRsvp(eventId, studentId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('RSVP canceled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel RSVP');
    },
  });
}
```

#### Task 8.1: Create useStats Hook

**File:** `src/lib/hooks/useStats.ts`

```typescript
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
```

### Phase 4: Update Components with Real Data (Tasks 10-13)

#### Task 10.1: Update Home Page

**Update:** `src/app/page.tsx`

Replace the mock data with:

```typescript
'use client';

import { useClubs } from '@/lib/hooks/useClubs';
import { useEvents } from '@/lib/hooks/useEvents';
import { usePlatformStats, useStudentStats } from '@/lib/hooks/useStats';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch data
  const { data: clubsData, isLoading: clubsLoading } = useClubs(
    undefined,
    { page: 1, limit: 6 }
  );
  
  const { data: eventsData, isLoading: eventsLoading } = useEvents(
    { upcoming: true },
    { page: 1, limit: 3 }
  );
  
  const { data: platformStats } = usePlatformStats();
  const { data: studentStats } = useStudentStats(user?.studentId || '');

  // Show loading skeletons
  if (clubsLoading || eventsLoading) {
    return <div>Loading...</div>; // Replace with proper skeletons
  }

  const clubs = clubsData?.items || [];
  const events = eventsData?.items || [];

  // Rest of your component using real data
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Use platformStats and studentStats for stats section */}
      {/* Use clubs array for clubs section */}
      {/* Use events array for events section */}
    </div>
  );
}
```

#### Task 11.1: Update ClubCard

**Update:** `src/components/clubs/ClubCard.tsx`

Add at the top:
```typescript
'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useJoinClub, useLeaveClub } from '@/lib/hooks/useClubs';
import { useRouter } from 'next/navigation';
```

Update the button logic:
```typescript
const { user, isAuthenticated } = useAuth();
const { mutate: joinClub, isPending: isJoining } = useJoinClub();
const { mutate: leaveClub, isPending: isLeaving } = useLeaveClub();
const router = useRouter();

const handleClick = () => {
  if (!isAuthenticated) {
    router.push('/login');
    return;
  }

  if (isJoined) {
    router.push(`/clubs/${id}`);
  } else {
    joinClub(id);
  }
};

const isLoading = isJoining || isLeaving;
```

### Adding Toast Notifications

**Update:** `src/app/layout.tsx`

Add Toaster component:
```typescript
import { Toaster } from 'sonner';

// In the body:
<body className={inter.className}>
  <QueryProvider>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  </QueryProvider>
</body>
```

## 🧪 Testing Checklist

After implementing each feature, test:

1. **Authentication**
   - [ ] Register new account
   - [ ] Login with credentials
   - [ ] Logout
   - [ ] Token persists on page refresh

2. **Clubs**
   - [ ] View clubs list
   - [ ] Filter clubs by category
   - [ ] Search clubs
   - [ ] Join a club
   - [ ] Leave a club

3. **Events**
   - [ ] View events list
   - [ ] Filter upcoming events
   - [ ] RSVP to event
   - [ ] Cancel RSVP

4. **Statistics**
   - [ ] Platform stats display correctly
   - [ ] Student stats show when logged in

## 🚀 Next Steps

1. Create login and register pages (Phase 2)
2. Create data fetching hooks (Phase 3)
3. Update home page with real data (Phase 4)
4. Update components with mutations (Phase 4)
5. Add toast notifications
6. Test everything thoroughly

## 📝 Notes

- All API calls are typed with TypeScript
- Error handling is built into the API client
- Toast notifications are ready to use with `toast.success()` and `toast.error()`
- React Query handles caching automatically
- Auth state persists across page refreshes

## 🆘 Troubleshooting

**Issue:** API calls fail with 404
- Check that your backend is running on the correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Issue:** Auth token not persisting
- Check browser localStorage
- Verify token is being set in AuthContext

**Issue:** TypeScript errors
- Run `npm run build` to check for type errors
- Ensure all imports are correct

Good luck with the implementation! 🎉
