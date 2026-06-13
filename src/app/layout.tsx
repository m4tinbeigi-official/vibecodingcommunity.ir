import './globals.css'
import { Providers } from './providers'
import { ReactNode } from 'react'

export const metadata = {
  title: 'انجمن برنامه‌نویسی وایب | Vibe Coding Community',
  description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند. یادگیری عملی، چالش‌های کدنویسی، و ارتباط با دیگر برنامه‌نویسان.',
  keywords: ['انجمن برنامه‌نویسی', 'برنامه‌نویسی', 'کدنویسی', 'یادگیری برنامه‌نویسی', 'چالش کدنویسی', 'پروژه برنامه‌نویسی', 'Vibe', 'وایب'],
  authors: [{ name: 'Vibe Coding Community' }],
  openGraph: {
    title: 'انجمن برنامه‌نویسی وایب | Vibe Coding Community',
    description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند.',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Vibe Coding Community',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'انجمن برنامه‌نویسی وایب | Vibe Coding Community',
    description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir">
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}