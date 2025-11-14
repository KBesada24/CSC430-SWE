import { NextResponse } from 'next/server';
import { errorResponse } from './api-response';

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, 'AUTHENTICATION_ERROR', message);
  }
}

/**
 * Authorization error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, 'AUTHORIZATION_ERROR', message);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

/**
 * Internal server error (500)
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message);
  }
}

/**
 * Global error handler for API routes
 */
export function handleError(error: unknown): NextResponse {
  // Handle known application errors
  if (error instanceof AppError) {
    return errorResponse(
      error.code,
      error.message,
      error.statusCode,
      error.details
    );
  }

  // Log unexpected errors for debugging
  console.error('Unexpected error:', error);

  // Return generic error response for unknown errors
  return errorResponse(
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    500
  );
}
