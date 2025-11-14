# EagleConnect API Documentation

This directory contains comprehensive documentation for the EagleConnect API.

## Contents

- **[API.md](./API.md)** - Complete API reference with all endpoints, request/response examples, and authentication flow
- **[EagleConnect-API.postman_collection.json](./EagleConnect-API.postman_collection.json)** - Postman collection for easy API testing

## Quick Start

### Using the API Documentation

1. Read through [API.md](./API.md) to understand:
   - Available endpoints
   - Authentication requirements
   - Request/response formats
   - Error handling
   - Rate limiting

### Using the Postman Collection

1. **Import the Collection**
   - Open Postman
   - Click "Import" button
   - Select `EagleConnect-API.postman_collection.json`

2. **Configure Variables**
   - The collection uses variables for easy testing
   - Default `baseUrl` is set to `http://localhost:3000/api`
   - Token and IDs are automatically set after successful requests

3. **Test the API**
   - Start with "Authentication > Register" to create an account
   - Then use "Authentication > Login" to get a token (automatically saved)
   - Use other endpoints with the saved token

### Environment Setup

Before using the API, ensure you have:

1. **Environment Variables** configured (see `.env.example`)
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Database** set up and running
   - Supabase project configured
   - Database migrations applied

3. **Development Server** running
   ```bash
   npm run dev
   ```

## API Overview

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## Endpoint Categories

1. **Authentication** - Register, login, logout
2. **Students** - Profile management
3. **Clubs** - Club CRUD operations
4. **Club Memberships** - Join, leave, manage memberships
5. **Events** - Event CRUD operations
6. **Event RSVPs** - RSVP management
7. **Statistics** - Platform and user statistics

## Rate Limits

- **Authentication endpoints**: 5 requests per 15 minutes
- **Registration**: 3 requests per hour
- **General API**: 100 requests per minute

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_ERROR` | 401 | Authentication required |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Testing Tips

1. **Use Postman Collection Variables**
   - Token is automatically saved after login
   - IDs are saved after creating resources

2. **Test in Order**
   - Register → Login → Create Club → Create Event → etc.

3. **Check Rate Limits**
   - Monitor rate limit headers
   - Wait if you hit limits

4. **Validate Responses**
   - Check status codes
   - Verify response structure
   - Test error cases

## Support

For questions or issues:
- Check the [API.md](./API.md) documentation
- Review error messages and codes
- Contact the development team

## Contributing

When updating the API:
1. Update [API.md](./API.md) with new endpoints
2. Add requests to the Postman collection
3. Document any breaking changes
4. Update error codes if new ones are added
