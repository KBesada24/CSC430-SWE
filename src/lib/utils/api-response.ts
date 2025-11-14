import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard API error response structure
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

/**
 * Creates a successful JSON response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Creates an error JSON response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: any
): NextResponse {
  return NextResponse.json<ApiError>(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Creates a paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  const totalPages = Math.ceil(total / limit);

  return successResponse<PaginatedResponse<T>>({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
