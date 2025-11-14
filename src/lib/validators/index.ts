/**
 * Central export file for all validation schemas
 * This allows for cleaner imports throughout the application
 */

// Authentication validators
export {
  registerSchema,
  loginSchema,
  type RegisterDto,
  type LoginDto,
} from './auth.validator';

// Club validators
export {
  createClubSchema,
  updateClubSchema,
  clubFiltersSchema,
  updateMembershipStatusSchema,
  membershipStatusFilterSchema,
  type CreateClubDto,
  type UpdateClubDto,
  type ClubFilters,
  type UpdateMembershipStatusDto,
  type MembershipStatusFilter,
} from './club.validator';

// Event validators
export {
  createEventSchema,
  updateEventSchema,
  eventFiltersSchema,
  type CreateEventDto,
  type UpdateEventDto,
  type EventFilters,
} from './event.validator';

// Student validators
export {
  updateStudentSchema,
  type UpdateStudentDto,
} from './student.validator';
