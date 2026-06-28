import * as crypto from 'crypto'

/**
 * Verify Telegram Mini App initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): { valid: boolean; user?: any; queryId?: string } {
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash || !botToken) return { valid: false }

    params.delete('hash')
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) return { valid: false }

    // Check auth_date freshness (max 1 hour)
    const authDate = parseInt(params.get('auth_date') || '0', 10)
    const now = Math.floor(Date.now() / 1000)
    if (now - authDate > 3600) return { valid: false }

    const userStr = params.get('user')
    const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null
    const queryId = params.get('query_id') || undefined

    return { valid: true, user, queryId }
  } catch {
    return { valid: false }
  }
}

/**
 * Bale Mini App uses same HMAC-SHA256 structure as Telegram.
 * https://dev.bale.ai/mini-apps
 */
export function verifyBaleInitData(
  initData: string,
  botToken: string
): { valid: boolean; user?: any } {
  // Bale uses the same algorithm as Telegram
  return verifyTelegramInitData(initData, botToken)
}
