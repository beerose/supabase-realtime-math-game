'use client'

import { classNames } from '@/lib/classNames'
import { supabaseClient } from '@/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const users = [
  {
    name: 'Bob',
    score: 100,
    online: true,
  },
  {
    name: 'Alice',
    score: 200,
    online: true,
  },
  {
    name: 'Charlie',
    score: 300,
    online: true,
  },
  {
    name: 'Derek',
    score: 400,
  },
  {
    name: 'Eve',
    score: 500,
    online: true,
  },
]

type GameState = {
  users: {
    name: string
    score: number
    online: boolean
  }[]
  cards: {
    id: number
    value: number
  }[]
  selectedIds: number[]
}

const numInputs = 4

const getGame = async (gameId: string) => {
  const gameResult = await supabaseClient
    .from('rooms')
    .select()
    .eq('name', gameId)
    .single()

  if (gameResult.error) {
    console.error(gameResult.error)
    return
  }

  return gameResult.data
}

export default function Example() {
  const routerParams = useParams()
  const router = useRouter()
  const [showResults, setShowResults] = useState(false)

  const [gameState, setGameState] = useState<GameState>({
    users,
    cards: Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 100),
    })),
    selectedIds: [],
  })

  useEffect(() => {
    const fetchGame = async () => {
      const game = await getGame(routerParams['game-id'] as string)
      if (!game) {
        router.push('/?error=game-not-found')
        return
      }
    }

    fetchGame()
  })

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="py-2 text-white rounded-lg shadow-lg flex items-center">
          Group code: {routerParams['game-id']}
          <button className="p-2 text-white rounded-lg shadow-lg group-hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5 hover:text-gray-200 hover:scale-110 transition duration-100"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center sm:grid sm:grid-cols-4 p-4 sm:p-10 w-full h-full">
        <div className="sm:hidden flex justify-center">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg my-2"
            onClick={() => setShowResults((state) => !state)}
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        </div>
        {showResults && <Results usersState={gameState.users} />}

        <div className="hidden sm:block sm:col-span-1">
          <Results usersState={gameState.users} />
        </div>
        <div className="col-span-3 py-2 flex flex-col items-center">
          <div className="grid grid-cols-5 gap-4 w-full">
            {gameState.cards.map((card, i) => (
              <div
                key={i}
                className={classNames(
                  'bg-gray-200 h-12 w-12 sm:h-16 sm:w-20 rounded-lg shadow-lg shadow-slate-600 flex items-center justify-center text-black ',
                  gameState.selectedIds.find((id) => id === card.id)
                    ? 'bg-gray-600 shadow-slate-700 scale-105 cursor-not-allowed hover:none'
                    : 'hover:bg-gray-300 hover:shadow-slate-700 transition duration-200 hover:scale-105 transform cursor-pointer',
                  gameState.selectedIds.length === numInputs &&
                    !gameState.selectedIds.find((id) => id === card.id) &&
                    'opacity-50 cursor-not-allowed'
                )}
                onClick={() => {
                  if (gameState.selectedIds.length === numInputs) return
                  if (gameState.selectedIds.find((id) => id === card.id)) return
                  setGameState((state) => ({
                    ...state,
                    selectedIds: [...state.selectedIds, card.id],
                  }))
                }}
              >
                {card.value}
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-center items-center mt-10 flex-wrap gap-y-2">
            {[1, 2, 3, 4].map((input, index) => (
              <div
                key={input}
                className="flex items-center"
              >
                {index > 0 && <span className="mx-2">+</span>}
                <div
                  className={classNames(
                    'text-black bg-white rounded-lg h-12 w-12 sm:h-16 sm:w-20 flex items-center justify-center text-center',
                    gameState.selectedIds[index]
                      ? 'bg-gray-200 shadow-slate-600 cursor-pointer hover:bg-gray-300'
                      : 'bg-gray-600 shadow-slate-700'
                  )}
                  onClick={() => {
                    if (!gameState.selectedIds[index]) return
                    setGameState((state) => ({
                      ...state,
                      selectedIds: state.selectedIds.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }}
                >
                  {gameState.cards[gameState.selectedIds[index]]?.value}
                </div>
              </div>
            ))}
            <div className="ml-2">= 32</div>
          </div>
        </div>
      </div>
    </>
  )
}

function Results({ usersState }: { usersState: typeof users }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Results</h2>
      <div className="flex flex-col">
        {usersState.map((user) => (
          <div
            key={user.name}
            className="py-2 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="">
                <div className="text-sm font-medium text-gray-100">
                  {user.name}
                  {user.online && (
                    <span className="ml-2 text-green-500">●</span>
                  )}
                </div>
                <div className="text-sm text-gray-200">{user.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
