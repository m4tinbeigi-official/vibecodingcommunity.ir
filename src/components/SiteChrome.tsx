'use client'

import { usePathname } from 'next/navigation'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

type Lang = 'fa' | 'en' | 'ar'

// Routes that ship their own full-screen chrome (sidebar/layout) and must NOT
// get the public header/footer.
const BARE_PREFIXES = ['/admin', '/dashboard']

function detectLang(pathname: string): Lang {
  const seg = pathname.split('/')[1]
  return seg === 'en' || seg === 'ar' ? (seg as Lang) : 'fa'
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const isBare = BARE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (isBare) {
    return <>{children}</>
  }

  const lang = detectLang(pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader lang={lang} />
      <div className="flex-1">{children}</div>
      <SiteFooter lang={lang} />
    </div>
  )
}
