'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const router = useSearchParams()

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      {router.has('error') && router.get('error') === 'game-not-found' && (
        <div className="px-8 pb-8 text-red-500 rounded-lg shadow-lg">
          Game not found. Create a new game or join an existing game.
        </div>
      )}
      <Link href="/new-game">
        <div className="px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg">
          Start New Game
        </div>
      </Link>
      <Link href="/join-game">
        <div className="mt-4 px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg">
          Join Existing Game
        </div>
      </Link>
    </div>
  )
}
