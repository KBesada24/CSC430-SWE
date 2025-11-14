/**
 * API Configuration
 * Centralized configuration for API settings
 */

/**
 * Request size limits (in bytes)
 */
export const REQUEST_SIZE_LIMITS = {
  // JSON body size limit: 1MB
  JSON: 1024 * 1024,
  
  // File upload size limit: 5MB
  FILE: 5 * 1024 * 1024,
} as const;

/**
 * API rate limits
 */
export const API_RATE_LIMITS = {
  // Authentication endpoints
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Registration endpoint (stricter)
  REGISTER: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // General API endpoints
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

/**
 * CORS configuration
 */
export const CORS_CONFIG = {
  // Allowed origins (can be overridden by ALLOWED_ORIGINS env var)
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ],
  
  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  
  // Allow credentials
  allowCredentials: true,
  
  // Max age for preflight cache (24 hours)
  maxAge: 86400,
} as const;

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

/**
 * Content Security Policy
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https:'],
  'frame-ancestors': ["'none'"],
} as const;

/**
 * JWT configuration
 */
export const JWT_CONFIG = {
  // Token expiration time
  expiresIn: '24h',
  
  // Token issuer
  issuer: 'eagleconnect-api',
  
  // Token audience
  audience: 'eagleconnect-app',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  // Default page number
  page: 1,
  
  // Default items per page
  limit: 10,
  
  // Maximum items per page
  maxLimit: 100,
} as const;

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    
    // API URL
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    
    // Database
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // JWT
    jwtSecret: process.env.JWT_SECRET,
    
    // CORS
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()),
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): void {
  const required = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'JWT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
