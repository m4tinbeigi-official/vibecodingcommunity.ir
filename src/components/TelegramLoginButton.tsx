'use client'

import { useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'

// Official Telegram Login Widget. The bot domain MUST be linked in BotFather
// via /setdomain -> vibecodingcommunity.ir for this widget to render.
export default function TelegramLoginButton({
  botUsername = 'VibeCodingIRBot',
  onError,
}: {
  botUsername?: string
  onError?: (message: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Global callback invoked by the Telegram widget after successful auth.
    ;(window as any).onTelegramAuth = (user: any) => {
      signIn('telegram', {
        authData: JSON.stringify(user),
        callbackUrl: '/dashboard',
      }).catch(() => onError?.('خطا در ورود با تلگرام'))
    }

    const container = containerRef.current
    if (!container) return

    // Avoid injecting the script twice.
    if (container.querySelector('script')) return

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [botUsername, onError])

  return <div ref={containerRef} className="flex justify-center" />
}
