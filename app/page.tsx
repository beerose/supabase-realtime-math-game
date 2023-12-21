import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
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
