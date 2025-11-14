import { NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/error-handler';

/**
 * Higher-order function to wrap API route handlers with error handling
 * Catches any errors thrown by the handler and formats them appropriately
 * 
 * @param handler - The API route handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandler<T>(
  handler: (request: NextRequest, context?: T) => Promise<Response>
) {
  return async (request: NextRequest, context?: T): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Combines multiple middleware wrappers into a single wrapper
 * Applies middleware in the order provided
 * 
 * @param middlewares - Array of middleware functions
 * @returns Combined middleware wrapper
 */
export function composeMiddleware<T>(
  ...middlewares: Array<
    (handler: (request: NextRequest, context?: T) => Promise<Response>) => 
    (request: NextRequest, context?: T) => Promise<Response>
  >
) {
  return (handler: (request: NextRequest, context?: T) => Promise<Response>) => {
    return middlewares.reduceRight(
      (wrappedHandler, middleware) => middleware(wrappedHandler),
      handler
    );
  };
}
