import crypto from 'crypto'

/**
 * Get avatar URL with fallback to Gravatar
 * If avatarUrl is provided, use it; otherwise use Gravatar based on email
 */
export function getAvatarUrl(avatarUrl?: string | null, email?: string | null): string {
  if (avatarUrl) {
    return avatarUrl
  }

  if (email) {
    // Use Gravatar with email hash
    const hash = crypto
      .createHash('md5')
      .update(email.toLowerCase().trim())
      .digest('hex')
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`
  }

  // Default avatar
  return `https://www.gravatar.com/avatar/?d=identicon&s=200`
}
