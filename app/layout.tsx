import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
          <div className="z-10 md:max-w-5xl w-full items-center font-mono text-sm flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center">
                Welcome to <span className="text-blue-500">M</span>
                <span className="text-red-500">a</span>
                <span className="text-yellow-500">t</span>
                <span className="text-blue-500">h</span>
                <span className="text-green-500">P</span>
                <span className="text-red-500">u</span>
                <span className="text-yellow-500">z</span>
                <span className="text-blue-500">z</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
                <span className="text-yellow-500">s</span>
              </h1>
              <p className="text-center my-2">
                A multiplayer math puzzle game to play and outsmart your
                friends.
              </p>
              <div className="sm:mt-4">{children}</div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
