/**
 * Invite Token Utility
 * Generates cryptographically secure invite tokens for clubs
 */

/**
 * Generate a cryptographically secure 64-character hex token
 * @returns A URL-safe 64-character hex string
 */
export function generateInviteToken(): string {
  // Generate 32 random bytes (will become 64 hex characters)
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  
  // Convert bytes to hex string
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate invite token format
 * @param token - The token to validate
 * @returns True if token is valid format (64 hex characters)
 */
export function isValidTokenFormat(token: string): boolean {
  return /^[0-9a-f]{64}$/.test(token);
}
