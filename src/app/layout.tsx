import './globals.css'
import { Providers } from './providers'
import { ReactNode } from 'react'
import SiteChrome from '@/components/SiteChrome'

export const metadata = {
  title: 'انجمن وایب کدینگ ایران',
  description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند. یادگیری عملی، چالش‌های کدنویسی، و ارتباط با دیگر برنامه‌نویسان.',
  keywords: ['انجمن برنامه‌نویسی', 'برنامه‌نویسی', 'کدنویسی', 'یادگیری برنامه‌نویسی', 'چالش کدنویسی', 'پروژه برنامه‌نویسی', 'Vibe', 'وایب'],
  authors: [{ name: 'انجمن وایب کدینگ ایران' }],
  openGraph: {
    title: 'انجمن وایب کدینگ ایران',
    description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند.',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'انجمن وایب کدینگ ایران',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'انجمن وایب کدینگ ایران',
    description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '7-NahUKvY88nOwTRKpwpVrZLbCYZ0YXzaa1XlbFHLrU',
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
            <SiteChrome>{children}</SiteChrome>
          </div>
        </Providers>
      </body>
    </html>
  )
}