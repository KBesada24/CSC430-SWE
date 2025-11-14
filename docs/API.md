# EagleConnect API Documentation

## Overview

The EagleConnect API is a RESTful API built with Next.js 14 App Router that provides endpoints for managing student clubs, events, and memberships at a university.

**Base URL**: `http://localhost:3000/api` (development)

**Authentication**: JWT Bearer token

**Content Type**: `application/json`

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Students](#student-endpoints)
  - [Clubs](#club-endpoints)
  - [Club Memberships](#club-membership-endpoints)
  - [Events](#event-endpoints)
  - [Event RSVPs](#event-rsvp-endpoints)
  - [Statistics](#statistics-endpoints)

---

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Obtaining a Token

Use the `/api/auth/login` endpoint to obtain a JWT token.

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_ERROR` | 401 | Authentication required or token invalid |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate entry) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

Rate limits are applied to protect the API:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Registration endpoint**: 3 requests per hour
- **General API endpoints**: 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the limit resets

---

## Endpoints

### Authentication Endpoints

#### Register a New Student

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "email": "john.doe@university.edu",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "studentId": "uuid",
      "email": "john.doe@university.edu",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

#### Logout

```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### Student Endpoints

#### Get Student Profile

```http
GET /api/students/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "email": "john.doe@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Student Profile

```http
PATCH /api/students/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "email": "jane.smith@university.edu",
    "firstName": "Jane",
    "lastName": "Smith",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Get Student Memberships

```http
GET /api/students/{id}/memberships
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "memberships": [
      {
        "studentId": "uuid",
        "clubId": "uuid",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "club": {
          "clubId": "uuid",
          "name": "Chess Club",
          "description": "University chess club",
          "category": "Academic",
          "coverPhotoUrl": "https://example.com/photo.jpg",
          "adminStudentId": "uuid",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

---

### Club Endpoints

#### List Clubs

```http
GET /api/clubs?category=Academic&search=chess&page=1&limit=10
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in name and description
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10, max: 100): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "clubId": "uuid",
        "name": "Chess Club",
        "description": "University chess club",
        "category": "Academic",
        "coverPhotoUrl": "https://example.com/photo.jpg",
        "adminStudentId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "memberCount": 25
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

#### Create Club

```http
POST /api/clubs
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Chess Club",
  "description": "University chess club for all skill levels",
  "category": "Academic",
  "coverPhotoUrl": "https://example.com/photo.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "clubId": "uuid",
    "name": "Chess Club",
    "description": "University chess club for all skill levels",
    "category": "Academic",
    "coverPhotoUrl": "https://example.com/photo.jpg",
    "adminStudentId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "memberCount": 1,
    "nextEvent": null
  }
}
```

---

#### Get Club Details

```http
GET /api/clubs/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clubId": "uuid",
    "name": "Chess Club",
    "description": "University chess club",
    "category": "Academic",
    "coverPhotoUrl": "https://example.com/photo.jpg",
    "adminStudentId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "memberCount": 25,
    "nextEvent": {
      "eventId": "uuid",
      "title": "Chess Tournament",
      "eventDate": "2024-02-01T18:00:00.000Z",
      "location": "Student Center"
    }
  }
}
```

---

#### Update Club

```http
PATCH /api/clubs/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "University Chess Club",
  "description": "Updated description"
}
```

**Response (200):** Same as Get Club Details

---

#### Delete Club

```http
DELETE /api/clubs/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Club deleted successfully"
  }
}
```

---

### Club Membership Endpoints

#### List Club Members

```http
GET /api/clubs/{id}/members?status=active
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `active`, `rejected`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "studentId": "uuid",
        "clubId": "uuid",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "student": {
          "studentId": "uuid",
          "email": "john.doe@university.edu",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

---

#### Join Club

```http
POST /api/clubs/{id}/members
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "clubId": "uuid",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Membership Status

```http
PATCH /api/clubs/{id}/members/{studentId}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "clubId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Leave Club

```http
DELETE /api/clubs/{id}/members/{studentId}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Member removed successfully"
  }
}
```

---

### Event Endpoints

#### List Events

```http
GET /api/events?clubId=uuid&upcoming=true&page=1&limit=10
```

**Query Parameters:**
- `clubId` (optional): Filter by club
- `upcoming` (optional): Filter upcoming events only
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10, max: 100): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "eventId": "uuid",
        "title": "Chess Tournament",
        "eventDate": "2024-02-01T18:00:00.000Z",
        "location": "Student Center",
        "description": "Annual chess tournament",
        "clubId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "club": {
          "clubId": "uuid",
          "name": "Chess Club",
          "category": "Academic"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 20,
      "totalPages": 2
    }
  }
}
```

---

#### Create Event

```http
POST /api/events
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Chess Tournament",
  "eventDate": "2024-02-01T18:00:00.000Z",
  "location": "Student Center",
  "description": "Annual chess tournament",
  "clubId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "eventId": "uuid",
    "title": "Chess Tournament",
    "eventDate": "2024-02-01T18:00:00.000Z",
    "location": "Student Center",
    "description": "Annual chess tournament",
    "clubId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "club": {
      "clubId": "uuid",
      "name": "Chess Club",
      "category": "Academic"
    },
    "attendeeCount": 0
  }
}
```

---

#### Get Event Details

```http
GET /api/events/{id}
```

**Response (200):** Same as Create Event response

---

#### Update Event

```http
PATCH /api/events/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Chess Tournament",
  "eventDate": "2024-02-02T18:00:00.000Z"
}
```

**Response (200):** Same as Get Event Details

---

#### Delete Event

```http
DELETE /api/events/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Event deleted successfully"
  }
}
```

---

### Event RSVP Endpoints

#### List Event Attendees

```http
GET /api/events/{id}/rsvps
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attendees": [
      {
        "studentId": "uuid",
        "eventId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "student": {
          "studentId": "uuid",
          "email": "john.doe@university.edu",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

---

#### RSVP to Event

```http
POST /api/events/{id}/rsvps
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "eventId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Cancel RSVP

```http
DELETE /api/events/{id}/rsvps/{studentId}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "RSVP canceled successfully"
  }
}
```

---

### Statistics Endpoints

#### Get Platform Statistics

```http
GET /api/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalClubs": 50,
    "totalMembers": 500,
    "upcomingEvents": 25
  }
}
```

---

#### Get Student Statistics

```http
GET /api/stats/student/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clubCount": 3,
    "upcomingEventCount": 5
  }
}
```

---

## Authentication Flow

1. **Register**: Create a new student account using `/api/auth/register`
2. **Login**: Authenticate and receive a JWT token using `/api/auth/login`
3. **Use Token**: Include the token in the `Authorization` header for protected endpoints
4. **Logout**: Invalidate the session using `/api/auth/logout`

## Authorization Rules

- **Students** can:
  - View their own profile and update it
  - View all clubs and events
  - Join clubs (creates pending membership)
  - RSVP to events
  - Leave clubs they're members of
  - Cancel their own RSVPs

- **Club Admins** can:
  - Update their club's information
  - Delete their club
  - Approve/reject membership requests
  - Create, update, and delete events for their club
  - View member lists

## Best Practices

1. **Always include error handling** for API calls
2. **Store JWT tokens securely** (e.g., httpOnly cookies or secure storage)
3. **Refresh tokens** before they expire
4. **Validate input** on the client side before sending requests
5. **Handle rate limiting** gracefully with exponential backoff
6. **Use pagination** for list endpoints to improve performance

## Support

For issues or questions, please contact the development team or create an issue in the repository.
