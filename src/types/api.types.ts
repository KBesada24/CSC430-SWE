/**
 * API Type Definitions
 * Centralized type definitions for API requests and responses
 */

// ============================================================================
// Base API Response Types
// ============================================================================

/**
 * Standard successful API response
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard error API response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Authentication DTOs
// ============================================================================

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  student: StudentProfile;
}

// ============================================================================
// Student DTOs
// ============================================================================

export interface StudentProfile {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string | null;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface MembershipWithClub {
  studentId: string;
  clubId: string;
  status: string;
  createdAt: string | null;
  club: ClubSummary;
}

export interface EventWithClub {
  eventId: string;
  title: string;
  eventDate: string;
  location: string;
  description: string | null;
  clubId: string;
  createdAt: string | null;
  club: ClubSummary;
}

// ============================================================================
// Club DTOs
// ============================================================================

export interface CreateClubDto {
  name: string;
  description?: string;
  category: string;
  coverPhotoUrl?: string;
}

export interface UpdateClubDto {
  name?: string;
  description?: string;
  category?: string;
  coverPhotoUrl?: string;
}

export interface ClubListItem {
  clubId: string;
  name: string;
  description: string | null;
  category: string;
  coverPhotoUrl: string | null;
  adminStudentId: string | null;
  createdAt: string | null;
  memberCount: number;
}

export interface ClubDetails extends ClubListItem {
  nextEvent: EventSummary | null;
}

export interface ClubSummary {
  clubId: string;
  name: string;
  description: string | null;
  category: string;
  coverPhotoUrl: string | null;
  adminStudentId: string | null;
  createdAt: string | null;
}

export interface MemberWithStudent {
  studentId: string;
  clubId: string;
  status: string;
  createdAt: string | null;
  student: StudentSummary;
}

export interface MembershipDto {
  studentId: string;
  clubId: string;
  status: string;
  createdAt: string | null;
}

export interface UpdateMembershipStatusDto {
  status: 'active' | 'rejected';
}

// ============================================================================
// Invite DTOs
// ============================================================================

export interface InviteToken {
  tokenId: string;
  clubId: string;
  token: string;
  createdAt: string;
}

export interface InviteDetails {
  inviteUrl: string;
  token: string;
}

export interface JoinViaInviteResponse {
  clubId: string;
  membership: MembershipDto;
}

// ============================================================================
// Event DTOs
// ============================================================================

export interface CreateEventDto {
  title: string;
  eventDate: string;
  location: string;
  description?: string;
  clubId: string;
}

export interface UpdateEventDto {
  title?: string;
  eventDate?: string;
  location?: string;
  description?: string;
}

export interface EventListItem {
  eventId: string;
  title: string;
  eventDate: string;
  location: string;
  description: string | null;
  clubId: string;
  createdAt: string | null;
  club: {
    clubId: string;
    name: string;
    category: string;
  };
}

export interface EventDetails extends EventListItem {
  attendeeCount: number;
}

export interface EventSummary {
  eventId: string;
  title: string;
  eventDate: string;
  location: string;
}

export interface AttendeeWithStudent {
  studentId: string;
  eventId: string;
  createdAt: string | null;
  student: StudentSummary;
}

export interface RsvpDto {
  studentId: string;
  eventId: string;
  createdAt: string | null;
}

// ============================================================================
// Statistics DTOs
// ============================================================================

export interface PlatformStats {
  totalClubs: number;
  totalMembers: number;
  upcomingEvents: number;
}

export interface StudentStats {
  clubCount: number;
  upcomingEventCount: number;
}

// ============================================================================
// Filter and Pagination Types
// ============================================================================

export interface ClubFilters {
  category?: string;
  search?: string;
}

export interface EventFilters {
  clubId?: string;
  upcoming?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface MembershipStatusFilter {
  status?: 'pending' | 'active' | 'rejected';
}

// ============================================================================
// Helper Types
// ============================================================================

export interface StudentSummary {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type MembershipStatus = 'pending' | 'active' | 'rejected';

// ============================================================================
// API Endpoint Response Types
// ============================================================================

// Auth endpoints
export type RegisterResponse = ApiResponse<{ studentId: string; email: string; firstName: string; lastName: string }>;
export type LoginApiResponse = ApiResponse<LoginResponse>;
export type LogoutResponse = ApiResponse<{ message: string }>;

// Student endpoints
export type GetStudentResponse = ApiResponse<StudentProfile>;
export type UpdateStudentResponse = ApiResponse<StudentProfile>;
export type GetMembershipsResponse = ApiResponse<{ memberships: MembershipWithClub[] }>;

// Club endpoints
export type GetClubsResponse = PaginatedResponse<ClubListItem>;
export type CreateClubResponse = ApiResponse<ClubDetails>;
export type GetClubResponse = ApiResponse<ClubDetails>;
export type UpdateClubResponse = ApiResponse<ClubDetails>;
export type DeleteClubResponse = ApiResponse<{ message: string }>;

// Club membership endpoints
export type GetMembersResponse = ApiResponse<{ members: MemberWithStudent[] }>;
export type AddMemberResponse = ApiResponse<MembershipDto>;
export type UpdateMemberStatusResponse = ApiResponse<MembershipDto>;
export type RemoveMemberResponse = ApiResponse<{ message: string }>;

// Event endpoints
export type GetEventsResponse = PaginatedResponse<EventListItem>;
export type CreateEventResponse = ApiResponse<EventDetails>;
export type GetEventResponse = ApiResponse<EventDetails>;
export type UpdateEventResponse = ApiResponse<EventDetails>;
export type DeleteEventResponse = ApiResponse<{ message: string }>;

// Event RSVP endpoints
export type GetAttendeesResponse = ApiResponse<{ attendees: AttendeeWithStudent[] }>;
export type CreateRsvpResponse = ApiResponse<RsvpDto>;
export type CancelRsvpResponse = ApiResponse<{ message: string }>;

// Stats endpoints
export type GetPlatformStatsResponse = ApiResponse<PlatformStats>;
export type GetStudentStatsResponse = ApiResponse<StudentStats>;

// Invite endpoints
export type GetInviteResponse = ApiResponse<InviteDetails>;
export type JoinViaInviteApiResponse = ApiResponse<JoinViaInviteResponse>;
