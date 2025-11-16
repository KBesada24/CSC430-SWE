# Frontend API Integration - Implementation Plan

## Phase 1: Infrastructure Setup

- [x] 1. Install and configure dependencies


  - [x] 1.1 Install TanStack Query (React Query)


    - Run `npm install @tanstack/react-query @tanstack/react-query-devtools`
    - _Requirements: 2.1, 2.2_
  - [x] 1.2 Install form handling libraries


    - Run `npm install react-hook-form @hookform/resolvers zod`
    - _Requirements: 1.1, 1.2_
  - [x] 1.3 Install additional utilities


    - Run `npm install sonner` (for toast notifications)
    - Run `npm install date-fns` (for date formatting)
    - _Requirements: 9.5_

- [x] 2. Create API client infrastructure


  - [x] 2.1 Create base API client



    - Create `src/lib/api/client.ts` with fetch wrapper
    - Implement request/response interceptors
    - Add error handling and transformation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 2.2 Create API service modules

    - Create `src/lib/api/auth.ts` for authentication endpoints
    - Create `src/lib/api/clubs.ts` for club endpoints
    - Create `src/lib/api/events.ts` for event endpoints
    - Create `src/lib/api/students.ts` for student endpoints
    - Create `src/lib/api/stats.ts` for statistics endpoints
    - _Requirements: 2.1, 2.4_
  - [x] 2.3 Set up TanStack Query provider


    - Create `src/lib/providers/QueryProvider.tsx`
    - Configure query client with default options
    - Add React Query DevTools for development
    - Wrap app with QueryClientProvider
    - _Requirements: 2.2, 3.3_

- [x] 3. Create authentication infrastructure



  - [x] 3.1 Create auth utilities

    - Create `src/lib/utils/auth.ts` for token management
    - Create `src/lib/utils/storage.ts` for localStorage helpers
    - _Requirements: 1.2, 1.3, 1.4_
  - [x] 3.2 Create AuthContext

    - Create `src/lib/contexts/AuthContext.tsx`
    - Implement authentication state management
    - Add login, register, logout functions
    - Persist auth state across page refreshes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 3.3 Create useAuth hook

    - Export useAuth hook from AuthContext
    - Provide type-safe access to auth state
    - _Requirements: 1.1, 1.2_

## Phase 2: Authentication Implementation

- [x] 4. Create authentication pages
  - [x] 4.1 Create login page
    - Create `src/app/(auth)/login/page.tsx`
    - Create `src/components/auth/LoginForm.tsx`
    - Implement form validation with Zod
    - Add loading and error states
    - _Requirements: 1.1, 1.3_
  - [x] 4.2 Create register page
    - Create `src/app/(auth)/register/page.tsx`
    - Create `src/components/auth/RegisterForm.tsx`
    - Implement form validation with Zod
    - Add loading and error states
    - _Requirements: 1.1_
  - [x] 4.3 Create protected route wrapper
    - Create `src/components/auth/ProtectedRoute.tsx`
    - Redirect unauthenticated users to login
    - Show loading state while checking auth
    - _Requirements: 1.1, 1.5_

- [x] 5. Update header with authentication
  - [x] 5.1 Update Header component
    - Display user name when authenticated
    - Show login/register buttons when not authenticated
    - Update profile dropdown with real user data
    - Implement logout functionality
    - _Requirements: 1.5, 10.3_

## Phase 3: Data Fetching Hooks

- [x] 6. Create club data hooks
  - [x] 6.1 Create useClubs hook
    - Create `src/lib/hooks/useClubs.ts`
    - Implement fetching clubs with filters and pagination
    - Add loading, error, and success states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3_
  - [x] 6.2 Create useClub hook
    - Implement fetching single club details
    - Include member count and next event
    - _Requirements: 3.1, 3.2, 4.4_
  - [x] 6.3 Create club mutation hooks
    - Create useJoinClub hook for joining clubs
    - Create useLeaveClub hook for leaving clubs
    - Create useCreateClub hook for creating clubs
    - Create useUpdateClub hook for updating clubs
    - Implement optimistic updates
    - _Requirements: 3.5, 7.1, 7.2, 7.3_

- [x] 7. Create event data hooks
  - [x] 7.1 Create useEvents hook
    - Create `src/lib/hooks/useEvents.ts`
    - Implement fetching events with filters and pagination
    - Add loading, error, and success states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2_
  - [x] 7.2 Create useEvent hook
    - Implement fetching single event details
    - Include club info and attendee count
    - _Requirements: 3.1, 3.2, 5.3_
  - [x] 7.3 Create event mutation hooks
    - Create useRsvpEvent hook for RSVPing
    - Create useCancelRsvp hook for canceling RSVPs
    - Create useCreateEvent hook for creating events
    - Create useUpdateEvent hook for updating events
    - Implement optimistic updates
    - _Requirements: 3.5, 8.1, 8.2, 8.3, 8.4_

- [x] 8. Create statistics hooks
  - [x] 8.1 Create useStats hooks
    - Create `src/lib/hooks/useStats.ts`
    - Create usePlatformStats hook
    - Create useStudentStats hook
    - _Requirements: 3.1, 3.2, 6.1, 6.2, 6.3, 6.4_

- [ ] 9. Create student profile hooks
  - [ ] 9.1 Create useStudent hooks
    - Create `src/lib/hooks/useStudent.ts`
    - Create useStudentProfile hook
    - Create useUpdateProfile hook
    - Create useStudentMemberships hook
    - _Requirements: 3.1, 3.2, 3.5, 10.1, 10.2_

## Phase 4: Replace Static Data

- [ ] 10. Update home page with real data
  - [ ] 10.1 Replace static club data
    - Update `src/app/page.tsx` to use useClubs hook
    - Remove mockClubs array
    - Add loading skeleton for clubs
    - Add error handling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2_
  - [ ] 10.2 Replace static event data
    - Update `src/app/page.tsx` to use useEvents hook
    - Remove mockEvents array
    - Add loading skeleton for events
    - Add error handling
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 9.1, 9.2_
  - [ ] 10.3 Replace static statistics
    - Update stats section to use usePlatformStats and useStudentStats
    - Remove hardcoded stat values
    - Add loading skeleton for stats
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 9.1_

- [ ] 11. Update ClubCard component
  - [ ] 11.1 Add join/leave functionality
    - Update `src/components/clubs/ClubCard.tsx`
    - Use useJoinClub and useLeaveClub hooks
    - Show correct button state based on membership
    - Add loading state to button
    - Show toast notification on success/error
    - _Requirements: 7.1, 7.2, 7.3, 9.5_

- [ ] 12. Update EventCard component
  - [ ] 12.1 Add RSVP functionality
    - Update `src/components/events/EventCard.tsx`
    - Use useRsvpEvent and useCancelRsvp hooks
    - Show RSVP status badge
    - Add loading state to button
    - Show toast notification on success/error
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.5_

- [ ] 13. Update ClubFilters component
  - [ ] 13.1 Connect filters to API
    - Update `src/components/clubs/ClubFilters.tsx`
    - Pass filter state to useClubs hook
    - Implement search functionality
    - Add category filtering
    - _Requirements: 4.2, 4.3_

## Phase 5: Create Detail Pages

- [ ] 14. Create club detail page
  - [ ] 14.1 Create club detail page
    - Create `src/app/clubs/[id]/page.tsx`
    - Use useClub hook to fetch club data
    - Display club information, members, and events
    - Add join/leave button
    - Show member list for admins
    - _Requirements: 4.4, 4.5, 7.1, 7.2, 7.4, 7.5_
  - [ ] 14.2 Create club management features
    - Add edit club form for admins
    - Add member approval/rejection for admins
    - Add create event button for admins
    - _Requirements: 7.4, 7.5_

- [ ] 15. Create event detail page
  - [ ] 15.1 Create event detail page
    - Create `src/app/events/[id]/page.tsx`
    - Use useEvent hook to fetch event data
    - Display event information and attendees
    - Add RSVP/cancel button
    - Show attendee list
    - _Requirements: 5.3, 5.4, 8.1, 8.2, 8.5_
  - [ ] 15.2 Create event management features
    - Add edit event form for club admins
    - Add delete event button for club admins
    - _Requirements: 5.2, 5.3_

- [ ] 16. Create profile page
  - [ ] 16.1 Create profile page
    - Create `src/app/profile/page.tsx`
    - Use useStudentProfile hook
    - Display user information
    - Show user's clubs and upcoming events
    - _Requirements: 10.1, 10.3_
  - [ ] 16.2 Add profile editing
    - Create profile edit form
    - Use useUpdateProfile hook
    - Add validation
    - Show success/error messages
    - _Requirements: 10.2, 10.4_

## Phase 6: Loading and Error States

- [ ] 17. Create loading components
  - [ ] 17.1 Create skeleton components
    - Create `src/components/ui/ClubCardSkeleton.tsx`
    - Create `src/components/ui/EventCardSkeleton.tsx`
    - Create `src/components/ui/StatsCardSkeleton.tsx`
    - _Requirements: 9.1_
  - [ ] 17.2 Add loading states to all data-fetching components
    - Update all components to show skeletons while loading
    - _Requirements: 9.1_

- [ ] 18. Create error components
  - [ ] 18.1 Create error boundary
    - Create `src/components/ErrorBoundary.tsx`
    - Handle unexpected errors gracefully
    - _Requirements: 9.2_
  - [ ] 18.2 Create error display components
    - Create `src/components/ui/ErrorMessage.tsx`
    - Add retry functionality
    - _Requirements: 9.2, 9.4_
  - [ ] 18.3 Add error handling to all components
    - Display user-friendly error messages
    - Add retry buttons where appropriate
    - _Requirements: 9.2, 9.3, 9.4_

## Phase 7: Polish and Optimization

- [ ] 19. Add toast notifications
  - [ ] 19.1 Set up toast provider
    - Add Sonner Toaster to root layout
    - _Requirements: 9.5_
  - [ ] 19.2 Add toasts for all actions
    - Show success toasts for join club, RSVP, etc.
    - Show error toasts for failed actions
    - _Requirements: 9.5_

- [ ] 20. Implement optimistic updates
  - [ ] 20.1 Add optimistic updates to mutations
    - Implement for join/leave club
    - Implement for RSVP/cancel RSVP
    - Implement for member count updates
    - _Requirements: 3.5, 7.1, 8.1_

- [ ] 21. Add data prefetching
  - [ ] 21.1 Prefetch on hover
    - Prefetch club details on ClubCard hover
    - Prefetch event details on EventCard hover
    - _Requirements: Performance optimization_

- [ ] 22. Implement pagination
  - [ ] 22.1 Add pagination to club list
    - Add pagination controls
    - Update useClubs hook to handle pagination
    - _Requirements: 3.4, 4.1_
  - [ ] 22.2 Add pagination to event list
    - Add pagination controls
    - Update useEvents hook to handle pagination
    - _Requirements: 3.4, 5.1_

- [ ] 23. Add search debouncing
  - [ ] 23.1 Debounce search inputs
    - Add debounce to club search
    - Add debounce to event search
    - _Requirements: 4.3, Performance optimization_

- [ ] 24. Final testing and bug fixes
  - [ ] 24.1 Test all user flows
    - Test registration and login
    - Test joining and leaving clubs
    - Test RSVP and cancel RSVP
    - Test profile updates
    - _Requirements: All_
  - [ ] 24.2 Fix any bugs found
    - Address edge cases
    - Fix UI issues
    - Improve error messages
    - _Requirements: All_

## Notes

- Each task should be completed and tested before moving to the next
- Commit code after completing each major task (1-2 tasks)
- Use TypeScript strictly - no `any` types
- Follow existing code style and conventions
- Add comments for complex logic
- Test on different screen sizes (responsive design)
