# Backend API Layer Design Document

## Overview

This design document outlines the architecture for EagleConnect's backend API layer. The system will use Next.js 14 App Router API routes to create a RESTful API that handles authentication, authorization, business logic, and data persistence using Supabase as the database layer.

The architecture follows a layered approach with clear separation of concerns:
- API Routes (presentation layer)
- Services (business logic layer)
- Repositories (data access layer)
- Middleware (cross-cutting concerns)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
┌────────────────────────▼────────────────────────────────────┐
│                    API Routes Layer                          │
│  /api/auth/*  /api/clubs/*  /api/events/*  /api/students/*  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Middleware Layer                           │
│         Authentication │ Authorization │ Validation          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Services Layer                            │
│   AuthService │ ClubService │ EventService │ StudentService  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Repositories Layer                          │
│  StudentRepo │ ClubRepo │ EventRepo │ MembershipRepo │ etc. │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Supabase Client                            │
│                  (PostgreSQL Database)                       │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── students/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── [id]/memberships/route.ts
│       ├── clubs/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   ├── [id]/members/route.ts
│       │   └── [id]/events/route.ts
│       ├── events/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── [id]/rsvps/route.ts
│       └── stats/
│           └── route.ts
├── lib/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── club.service.ts
│   │   └── event.service.ts
│   ├── repositories/
│   │   ├── student.repository.ts
│   │   ├── club.repository.ts
│   │   ├── event.repository.ts
│   │   ├── membership.repository.ts
│   │   └── rsvp.repository.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── club.validator.ts
│   │   ├── event.validator.ts
│   │   └── student.validator.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils/
│       ├── api-response.ts
│       ├── error-handler.ts
│       └── password.ts
└── types/
    ├── api.types.ts
    └── supabase.ts (existing)
```

## Components and Interfaces

### 1. API Routes Layer

API routes handle HTTP requests and responses, delegating business logic to services.

#### Authentication Routes

**POST /api/auth/register**
- Request: `{ firstName, lastName, email, password }`
- Response: `{ success: true, data: { studentId, email, firstName, lastName } }`
- Creates new student account with hashed password

**POST /api/auth/login**
- Request: `{ email, password }`
- Response: `{ success: true, data: { token, student: {...} } }`
- Authenticates student and returns session token

**POST /api/auth/logout**
- Request: Authenticated
- Response: `{ success: true }`
- Invalidates current session

#### Student Routes

**GET /api/students/[id]**
- Response: `{ success: true, data: { student: {...} } }`
- Returns student profile (excluding password)

**PATCH /api/students/[id]**
- Request: `{ firstName?, lastName?, email? }`
- Response: `{ success: true, data: { student: {...} } }`
- Updates student profile (requires authentication as that student)

**GET /api/students/[id]/memberships**
- Response: `{ success: true, data: { memberships: [...] } }`
- Returns all club memberships for the student

#### Club Routes

**GET /api/clubs**
- Query params: `?category=<category>&search=<query>&page=1&limit=10`
- Response: `{ success: true, data: { clubs: [...], pagination: {...} } }`
- Returns filtered and paginated club list

**POST /api/clubs**
- Request: `{ name, description, category, coverPhotoUrl? }`
- Response: `{ success: true, data: { club: {...} } }`
- Creates new club (authenticated student becomes admin)

**GET /api/clubs/[id]**
- Response: `{ success: true, data: { club: {...}, nextEvent: {...}, memberCount: number } }`
- Returns detailed club information

**PATCH /api/clubs/[id]**
- Request: `{ name?, description?, category?, coverPhotoUrl? }`
- Response: `{ success: true, data: { club: {...} } }`
- Updates club (requires admin authorization)

**DELETE /api/clubs/[id]**
- Response: `{ success: true }`
- Deletes club (requires admin authorization)

**GET /api/clubs/[id]/members**
- Query params: `?status=<pending|active|rejected>`
- Response: `{ success: true, data: { members: [...] } }`
- Returns club members (filtered by status if provided)

**POST /api/clubs/[id]/members**
- Request: `{ studentId }`
- Response: `{ success: true, data: { membership: {...} } }`
- Creates membership request (authenticated student joins club)

**PATCH /api/clubs/[id]/members/[studentId]**
- Request: `{ status: 'active' | 'rejected' }`
- Response: `{ success: true, data: { membership: {...} } }`
- Updates membership status (requires admin authorization)

**DELETE /api/clubs/[id]/members/[studentId]**
- Response: `{ success: true }`
- Removes member from club (student leaves or admin removes)

**GET /api/clubs/[id]/events**
- Response: `{ success: true, data: { events: [...] } }`
- Returns all events for the club

#### Event Routes

**GET /api/events**
- Query params: `?clubId=<id>&upcoming=true&page=1&limit=10`
- Response: `{ success: true, data: { events: [...], pagination: {...} } }`
- Returns filtered and paginated event list

**POST /api/events**
- Request: `{ title, eventDate, location, description, clubId }`
- Response: `{ success: true, data: { event: {...} } }`
- Creates new event (requires club admin authorization)

**GET /api/events/[id]**
- Response: `{ success: true, data: { event: {...}, club: {...}, attendeeCount: number } }`
- Returns detailed event information

**PATCH /api/events/[id]**
- Request: `{ title?, eventDate?, location?, description? }`
- Response: `{ success: true, data: { event: {...} } }`
- Updates event (requires club admin authorization)

**DELETE /api/events/[id]**
- Response: `{ success: true }`
- Deletes event (requires club admin authorization)

**GET /api/events/[id]/rsvps**
- Response: `{ success: true, data: { attendees: [...] } }`
- Returns list of students who RSVP'd

**POST /api/events/[id]/rsvps**
- Request: `{ studentId }`
- Response: `{ success: true, data: { rsvp: {...} } }`
- Creates RSVP (authenticated student RSVPs to event)

**DELETE /api/events/[id]/rsvps/[studentId]**
- Response: `{ success: true }`
- Cancels RSVP (student cancels their RSVP)

#### Stats Routes

**GET /api/stats**
- Response: `{ success: true, data: { totalClubs, totalMembers, upcomingEvents } }`
- Returns platform-wide statistics

**GET /api/stats/student/[id]**
- Response: `{ success: true, data: { clubCount, upcomingEventCount } }`
- Returns personal statistics for authenticated student

### 2. Services Layer

Services contain business logic and orchestrate repository operations.

#### AuthService

```typescript
interface AuthService {
  register(data: RegisterDto): Promise<StudentResponse>
  login(email: string, password: string): Promise<LoginResponse>
  logout(token: string): Promise<void>
  verifyToken(token: string): Promise<Student>
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
}
```

Key responsibilities:
- Password hashing using bcrypt
- JWT token generation and verification
- Session management
- Input validation for auth operations

#### StudentService

```typescript
interface StudentService {
  getById(id: string): Promise<Student>
  update(id: string, data: UpdateStudentDto): Promise<Student>
  getMemberships(studentId: string): Promise<Membership[]>
  getUpcomingEvents(studentId: string): Promise<Event[]>
}
```

Key responsibilities:
- Student profile management
- Membership retrieval
- Personal event calendar

#### ClubService

```typescript
interface ClubService {
  getAll(filters: ClubFilters, pagination: Pagination): Promise<PaginatedResponse<Club>>
  getById(id: string): Promise<ClubWithDetails>
  create(data: CreateClubDto, adminId: string): Promise<Club>
  update(id: string, data: UpdateClubDto): Promise<Club>
  delete(id: string): Promise<void>
  getMembers(clubId: string, status?: MembershipStatus): Promise<Member[]>
  addMember(clubId: string, studentId: string): Promise<Membership>
  updateMemberStatus(clubId: string, studentId: string, status: MembershipStatus): Promise<Membership>
  removeMember(clubId: string, studentId: string): Promise<void>
  isAdmin(clubId: string, studentId: string): Promise<boolean>
}
```

Key responsibilities:
- Club CRUD operations
- Membership management
- Admin verification
- Search and filtering logic

#### EventService

```typescript
interface EventService {
  getAll(filters: EventFilters, pagination: Pagination): Promise<PaginatedResponse<Event>>
  getById(id: string): Promise<EventWithDetails>
  create(data: CreateEventDto, clubId: string): Promise<Event>
  update(id: string, data: UpdateEventDto): Promise<Event>
  delete(id: string): Promise<void>
  getAttendees(eventId: string): Promise<Student[]>
  addRsvp(eventId: string, studentId: string): Promise<Rsvp>
  removeRsvp(eventId: string, studentId: string): Promise<void>
  validateEventDate(date: string): boolean
}
```

Key responsibilities:
- Event CRUD operations
- RSVP management
- Date validation
- Event filtering and search

### 3. Repositories Layer

Repositories handle direct database interactions using Supabase client.

#### StudentRepository

```typescript
interface StudentRepository {
  create(data: CreateStudentData): Promise<Student>
  findById(id: string): Promise<Student | null>
  findByEmail(email: string): Promise<Student | null>
  update(id: string, data: Partial<Student>): Promise<Student>
  delete(id: string): Promise<void>
}
```

#### ClubRepository

```typescript
interface ClubRepository {
  create(data: CreateClubData): Promise<Club>
  findById(id: string): Promise<Club | null>
  findAll(filters: ClubFilters, pagination: Pagination): Promise<{ clubs: Club[], total: number }>
  update(id: string, data: Partial<Club>): Promise<Club>
  delete(id: string): Promise<void>
  getMemberCount(clubId: string): Promise<number>
  getNextEvent(clubId: string): Promise<Event | null>
}
```

#### EventRepository

```typescript
interface EventRepository {
  create(data: CreateEventData): Promise<Event>
  findById(id: string): Promise<Event | null>
  findAll(filters: EventFilters, pagination: Pagination): Promise<{ events: Event[], total: number }>
  findByClubId(clubId: string): Promise<Event[]>
  update(id: string, data: Partial<Event>): Promise<Event>
  delete(id: string): Promise<void>
  getAttendeeCount(eventId: string): Promise<number>
}
```

#### MembershipRepository

```typescript
interface MembershipRepository {
  create(studentId: string, clubId: string): Promise<Membership>
  findByStudentAndClub(studentId: string, clubId: string): Promise<Membership | null>
  findByStudent(studentId: string): Promise<Membership[]>
  findByClub(clubId: string, status?: MembershipStatus): Promise<Membership[]>
  updateStatus(studentId: string, clubId: string, status: MembershipStatus): Promise<Membership>
  delete(studentId: string, clubId: string): Promise<void>
}
```

#### RsvpRepository

```typescript
interface RsvpRepository {
  create(studentId: string, eventId: string): Promise<Rsvp>
  findByStudentAndEvent(studentId: string, eventId: string): Promise<Rsvp | null>
  findByStudent(studentId: string): Promise<Rsvp[]>
  findByEvent(eventId: string): Promise<Rsvp[]>
  delete(studentId: string, eventId: string): Promise<void>
}
```

### 4. Middleware Layer

#### Authentication Middleware

```typescript
async function withAuth(handler: NextApiHandler): Promise<NextApiHandler> {
  // Extracts and verifies JWT token from Authorization header
  // Attaches authenticated student to request context
  // Returns 401 if token is invalid or missing
}
```

#### Authorization Middleware

```typescript
async function withClubAdmin(clubId: string, studentId: string): Promise<boolean> {
  // Verifies that the student is the admin of the specified club
  // Returns 403 if not authorized
}
```

#### Validation Middleware

```typescript
function validateRequest<T>(schema: ZodSchema<T>) {
  // Validates request body against Zod schema
  // Returns 400 with validation errors if invalid
}
```

### 5. Validators

Using Zod for runtime type validation:

```typescript
// auth.validator.ts
const registerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(8).max(100)
})

// club.validator.ts
const createClubSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(100),
  coverPhotoUrl: z.string().url().optional()
})

// event.validator.ts
const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  eventDate: z.string().datetime(),
  location: z.string().min(1).max(255),
  description: z.string().optional(),
  clubId: z.string().uuid()
})
```

## Data Models

### API Response Types

```typescript
// Success Response
interface ApiResponse<T> {
  success: true
  data: T
}

// Error Response
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

// Paginated Response
interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### DTOs (Data Transfer Objects)

```typescript
interface RegisterDto {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface LoginDto {
  email: string
  password: string
}

interface CreateClubDto {
  name: string
  description?: string
  category: string
  coverPhotoUrl?: string
}

interface UpdateClubDto {
  name?: string
  description?: string
  category?: string
  coverPhotoUrl?: string
}

interface CreateEventDto {
  title: string
  eventDate: string
  location: string
  description?: string
  clubId: string
}

interface UpdateEventDto {
  title?: string
  eventDate?: string
  location?: string
  description?: string
}

interface ClubFilters {
  category?: string
  search?: string
}

interface EventFilters {
  clubId?: string
  upcoming?: boolean
}

interface Pagination {
  page: number
  limit: number
}
```

## Error Handling

### Error Types

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
  }
}

class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details)
  }
}

class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, 'AUTHENTICATION_ERROR', message)
  }
}

class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, 'AUTHORIZATION_ERROR', message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
  }
}

class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message)
  }
}
```

### Error Handler

```typescript
function handleError(error: unknown): Response {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    },
    { status: 500 }
  )
}
```

## Testing Strategy

### Unit Tests

- Test each service method in isolation with mocked repositories
- Test repository methods with mocked Supabase client
- Test validators with various input scenarios
- Test utility functions (password hashing, token generation)

Focus areas:
- Business logic correctness
- Edge cases and error conditions
- Input validation
- Data transformation

### Integration Tests

- Test API routes end-to-end with test database
- Test authentication and authorization flows
- Test database transactions and rollbacks
- Test middleware chain execution

Focus areas:
- Request/response handling
- Database operations
- Authentication/authorization
- Error handling

### Test Data

- Use factory functions to generate test data
- Use separate test database or Supabase local development
- Clean up test data after each test
- Use meaningful test scenarios based on user stories

## Security Considerations

### Authentication

- Use bcrypt for password hashing with salt rounds of 10
- Generate JWT tokens with 24-hour expiration
- Store JWT secret in environment variables
- Implement token refresh mechanism for better UX

### Authorization

- Verify club admin status before allowing club modifications
- Ensure students can only modify their own profiles
- Validate resource ownership before operations
- Implement rate limiting on authentication endpoints

### Input Validation

- Validate all inputs using Zod schemas
- Sanitize user input to prevent XSS attacks
- Use parameterized queries (Supabase handles this)
- Implement CORS with specific origin whitelist

### Data Protection

- Never return password hashes in API responses
- Use HTTPS in production
- Implement request size limits
- Log security-relevant events (failed logins, etc.)

## Performance Considerations

### Database Optimization

- Use existing database indexes (already defined in schema)
- Implement pagination for list endpoints (default 10 items)
- Use select specific columns instead of SELECT *
- Implement database connection pooling (Supabase handles this)

### Caching Strategy

- Cache frequently accessed data (club lists, event lists)
- Use stale-while-revalidate pattern for non-critical data
- Implement cache invalidation on data mutations
- Consider Redis for session storage in production

### API Optimization

- Implement request debouncing on frontend
- Use HTTP compression
- Minimize payload sizes
- Implement conditional requests (ETags)

## Deployment Considerations

### Environment Variables

```
DATABASE_URL=<supabase-connection-string>
SUPABASE_URL=<supabase-project-url>
SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
JWT_SECRET=<random-secret-key>
NODE_ENV=production
```

### Monitoring

- Log all errors with stack traces
- Monitor API response times
- Track authentication failures
- Set up alerts for high error rates

### Database Migrations

- Use Supabase migrations for schema changes
- Test migrations in staging environment
- Implement rollback procedures
- Document all schema changes
