import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'digifridge — code with magnets',
  description: 'A digital fridge where coding blocks are magnets you can drag to write programs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  )
}
