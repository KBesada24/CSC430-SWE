import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '@/lib/utils/error-handler';

/**
 * Validates request body against a Zod schema
 * 
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated and typed data
 * @throws ValidationError if validation fails
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Validation failed', formattedErrors);
    }
    throw new ValidationError('Invalid request body');
  }
}

/**
 * Validates query parameters against a Zod schema
 * 
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated and typed query parameters
 * @throws ValidationError if validation fails
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const validatedData = schema.parse(params);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Query parameter validation failed', formattedErrors);
    }
    throw new ValidationError('Invalid query parameters');
  }
}

/**
 * Higher-order function to wrap API route handlers with validation
 * 
 * @param schema - Zod schema to validate request body against
 * @param handler - The API route handler function
 * @returns Wrapped handler with validation
 */
export function withValidation<T, R>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, validatedData: T, context?: R) => Promise<Response>
) {
  return async (request: NextRequest, context?: R): Promise<Response> => {
    const validatedData = await validateRequest(request, schema);
    return handler(request, validatedData, context);
  };
}
