# Implementation Plan

- [x] 1. Create database migration for invite tokens table


  - Write SQL migration file to create the invite_tokens table with proper indexes and constraints
  - Add UNIQUE constraint on club_id to ensure one token per club
  - Create indexes on token and club_id columns for performance
  - _Requirements: 2.5, 5.2_

- [x] 2. Update TypeScript types for invite functionality


  - Add InviteToken, InviteDetails, and JoinViaInviteResponse interfaces to api.types.ts
  - Add GetInviteResponse and JoinViaInviteApiResponse type aliases
  - Update CreateClubResponse to optionally include inviteToken
  - _Requirements: 2.2, 2.3, 3.1_

- [x] 3. Implement token generation utility


  - Create a utility function to generate cryptographically secure 64-character hex tokens
  - Ensure tokens are URL-safe and have sufficient entropy
  - _Requirements: 2.2, 2.5_

- [x] 4. Create API endpoint for generating/fetching club invites


  - Implement GET /api/clubs/[clubId]/invite route
  - Verify requester is the club admin
  - Fetch existing invite token or create new one if none exists
  - Return full invite URL with token
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Create API endpoint for joining via invite token


  - Implement POST /api/invites/[token]/join route
  - Validate token exists in database
  - Check if student is already a member
  - Create membership with 'active' status
  - Handle error cases (invalid token, already member)
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 6. Enhance club creation API to generate invite token


  - Modify POST /api/clubs route to generate invite token after club creation
  - Store token in invite_tokens table
  - Optionally return token in response
  - _Requirements: 1.2, 2.2, 2.5_

- [x] 7. Add invite-related functions to clubs API client


  - Add getInvite(clubId) function to clubsApi
  - Add joinViaInvite(token) function to clubsApi
  - Implement proper error handling and type safety
  - _Requirements: 2.1, 3.1_

- [x] 8. Create React Query hooks for invite functionality


  - Implement useClubInvite(clubId) hook for fetching invite data
  - Implement useJoinViaInvite() mutation hook for joining via token
  - Add proper cache invalidation on successful join
  - _Requirements: 2.1, 3.3_

- [x] 9. Build Create Club page component


  - Create /clubs/create page with form for club details
  - Add form fields: name, description, category, coverPhotoUrl
  - Implement form validation (name 3-100 chars, required fields)
  - Use useCreateClub hook for submission
  - Redirect to club detail page on success
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 10. Add invite section to club detail page


  - Create ClubInviteSection component visible only to club admins
  - Display readonly input with full invite URL
  - Add copy-to-clipboard button with icon
  - Show success toast on successful copy
  - Use useClubInvite hook to fetch invite data
  - _Requirements: 2.1, 2.3, 2.4, 4.1, 4.2, 4.3_

- [x] 11. Create invite join page


  - Implement /invites/[token] page for processing invite links
  - Check authentication status and redirect to login if needed
  - Preserve invite token in URL for post-login redirect
  - Display club preview before joining
  - Use useJoinViaInvite hook to process join
  - Handle error states (invalid token, already member)
  - Redirect to club page on successful join
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 12. Add navigation link to create club page


  - Add "Create Club" button or link in appropriate location (header, clubs list page)
  - Ensure link is visible only to authenticated users
  - _Requirements: 1.1_

- [x] 13. Implement clipboard copy functionality

  - Use Clipboard API to copy invite URL
  - Add fallback for browsers without Clipboard API support
  - Display appropriate success/error messages
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 14. Add error handling and user feedback

  - Implement toast notifications for all success/error states
  - Add inline validation errors on create club form
  - Display user-friendly error messages for invite-related errors
  - Handle edge cases (club not found, unauthorized access)
  - _Requirements: 1.3, 3.5, 4.2_

- [x] 15. Write integration tests for invite flow



  - Test complete club creation with invite generation
  - Test invite link generation for existing clubs
  - Test joining via valid invite token
  - Test error cases (invalid token, already member, unauthenticated)
  - _Requirements: All_
