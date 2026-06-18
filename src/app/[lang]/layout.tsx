import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'انجمن وایب کدینگ ایران',
  description: 'جایی برای برنامه‌نویسان که یاد بگیرند، پروژه بسازند و با هم رشد کنند.',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dir = ['fa', 'ar'].includes(params.lang) ? 'rtl' : 'ltr'

  return (
    <html lang={params.lang} dir={dir}>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {children}
        </div>
      </body>
    </html>
  )
}
