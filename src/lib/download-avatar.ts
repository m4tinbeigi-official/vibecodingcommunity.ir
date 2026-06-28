import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

/**
 * Downloads a remote avatar URL (e.g. Telegram photo_url) and saves it
 * to /public/uploads/avatars/ on our server.
 * Returns the local path (/uploads/avatars/xxx.jpg) or null on failure.
 */
export async function downloadAndSaveAvatar(remoteUrl: string): Promise<string | null> {
  try {
    const res = await fetch(remoteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') || ''
    const ext = contentType.includes('png') ? 'png' : 'jpg'
    const filename = `tg_${crypto.randomUUID()}.${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'avatars')

    await fs.mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await res.arrayBuffer())
    await fs.writeFile(path.join(dir, filename), buffer)

    return `/uploads/avatars/${filename}`
  } catch {
    return null
  }
}
