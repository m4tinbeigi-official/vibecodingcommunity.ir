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
    <div dir={dir} className={inter.className}>
      {children}
    </div>
  )
}
