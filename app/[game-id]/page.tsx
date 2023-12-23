'use client'

import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  REALTIME_PRESENCE_LISTEN_EVENTS,
} from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { emojisplosion } from 'emojisplosion'
import { supabaseClient } from '@/supabase/client'
import { classNames } from '@/lib/classNames'
import { generateCards } from '@/lib/generateCards'
import { GameState, Player } from '@/lib/types'

const defaultGameState: GameState = {
  cards: Array.from({ length: 16 }, (_, i) => ({
    id: i,
  })),
  numOfInputs: 3,
  selectedCardIds: [],
  expectedResult: 0,
  status: 'idle',
}

const getGame = async (gameId: string) => {
  const gameResult = await supabaseClient
    .from('rooms')
    .select()
    .eq('room_name', gameId)
    .single()

  if (gameResult.error) {
    console.error(gameResult.error)
    return null
  }

  return gameResult.data
}

const upsertResult = async (gameId: string, name: string, result: number) => {
  await supabaseClient.from('results').upsert({
    room_name: gameId,
    name: name,
    result: result,
  })
}

export default function Game() {
  const routerParams = useParams()
  const router = useRouter()
  const roomName = routerParams['game-id'] as string

  const [showResults, setShowResults] = useState(false)
  const [users, setUsers] = useState<Player[]>([])
  const currentUser =
    (typeof window !== 'undefined' && sessionStorage.getItem('name')) || ''
  const [ready, setReady] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [startGameCounter, setStartGameCounter] = useState<number | null>(null)
  const [counter, setCounter] = useState(10 * 60)
  const [isResetting, setIsResetting] = useState(false)
  const [usersSynced, setUsersSynced] = useState(false)

  const [gameState, setGameState] = useState<GameState>(defaultGameState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (currentUser === '') {
      router.push(`/join-game?game-id=${roomName}`)
    }
    const fetchGame = async () => {
      const game = await getGame(roomName)
      if (!game) {
        router.push('/?error=game-not-found')
        return
      }
    }
    fetchGame()
  }, [roomName, router, currentUser])

  useEffect(() => {
    if (startGameCounter === null) return
    if (startGameCounter === 0) {
      setGameStarted(true)
      setStartGameCounter(null)
      setGameState({
        status: 'started',
        ...generateCards(),
        selectedCardIds: [],
      })
      return
    }
    if (startGameCounter > 0) {
      setTimeout(() => {
        setStartGameCounter((state) => (state || 0) - 1)
      }, 1000)
    }
  }, [startGameCounter])

  useEffect(() => {
    if (!gameStarted) return
    if (counter === 0) {
      // TOOD: set game started in DB and sync if user refreshes the page
      setGameStarted(false)
      setCounter(10 * 60)
      setGameState({
        ...defaultGameState,
        status: 'finished',
      })
      return
    }
    if (counter > 0) {
      setTimeout(() => {
        setCounter((state) => (state || 0) - 1)
      }, 1000)
    }
  }, [gameStarted, counter])

  useEffect(() => {
    const room = supabaseClient.channel(roomName)

    room
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        ({ newPresences }) => {
          setUsers((state) => {
            const newUsers = newPresences.map((presence) => ({
              name: presence.name,
              score: 0,
            }))
            return [...state, ...newUsers]
          })
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        ({ leftPresences }) => {
          setUsers((state) => {
            const newUsers = state.filter(
              (user) => !leftPresences.some((p) => p.name === user.name)
            )
            return newUsers
          })
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        () => {
          if (usersSynced) return
          const state = room.presenceState<{
            name: string
            result: number
            ready: boolean
          }>()
          setUsers(
            Object.values(state).map((presence) => ({
              name: presence?.[0]?.name,
              score: 0,
              ready: presence?.[0]?.ready,
            }))
          )
          setUsersSynced(true)
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: 'public',
          table: 'results',
          filter: `room_name=eq.${roomName}`,
        },
        (e) => {
          setUsers((state) =>
            state.map((user) =>
              user.name === e.new.name
                ? {
                    ...user,
                    score: e.new.result,
                  }
                : user
            )
          )
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: 'ready' },
        ({ payload }) => {
          setUsers((state) => {
            const newState = state.map((user) => {
              if (user.name === payload.username) {
                return {
                  ...user,
                  ready: true,
                }
              }
              return user
            })
            if (newState.every((user) => user.ready)) {
              setStartGameCounter(5)
            }
            return newState
          })
        }
      )
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          return
        }

        await room.track({
          name: currentUser,
          result: 0,
          ready,
        })
      })

    return () => {
      void supabaseClient.removeChannel(room)
    }
  }, [roomName, currentUser])

  useEffect(() => {
    if (!gameStarted) return
    if (gameState.selectedCardIds.length !== gameState.numOfInputs) return

    const result = gameState.selectedCardIds.reduce(
      (acc, curr) => acc + (gameState.cards?.[curr].value || 0),
      0
    )

    if (result === gameState.expectedResult) {
      emojisplosion()
      setGameState((state) => ({
        ...state,
        ...generateCards(),
        selectedCardIds: [],
      }))
      upsertResult(
        roomName,
        currentUser,
        (users.find((u) => u.name === currentUser)?.score || 0) + 100
      )
    } else {
      setIsResetting(true)
      setTimeout(() => {
        setGameState((state) => ({
          ...state,
          selectedCardIds: [],
        }))
        setIsResetting(false)
      }, 500)
    }
  }, [gameState, gameStarted])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="py-2 text-white rounded-lg shadow-lg flex items-center">
          Group code: {roomName}
          <button
            className="p-2 text-white rounded-lg shadow-lg group-hover"
            onClick={() => {
              navigator.clipboard.writeText(roomName)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 hover:text-gray-200 hover:scale-110 transition duration-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="sm:hidden flex justify-center">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg my-2"
          onClick={() => setShowResults((state) => !state)}
        >
          {showResults ? 'Hide Results' : 'Show Results'}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-2 h-8 text-center">
        {gameState.status === 'finished' && (
          <div className="text-xl font-bold text-white mt-4">
            Game Over! 🎉🎉🎉
          </div>
        )}
        {!users.every((user) => user.ready) ? (
          ready ? (
            <div>Waiting for others to be ready...</div>
          ) : (
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              onClick={async () => {
                const room = supabaseClient.channel(roomName)
                await room.send({
                  type: 'broadcast',
                  event: 'ready',
                  payload: { username: currentUser },
                })
                setReady(true)
              }}
            >
              Ready
            </button>
          )
        ) : null}
        {startGameCounter && startGameCounter > 0 ? (
          <span>Game starting in {startGameCounter}...</span>
        ) : null}
        {gameStarted && (
          <span>
            Time remaining: {Math.floor(counter / 60)}:{counter % 60}
          </span>
        )}
      </div>

      {showResults && (
        <Results
          usersState={users}
          currentUser={currentUser}
        />
      )}
      <div className="flex flex-col justify-center sm:grid sm:grid-cols-4 p-4 sm:p-10 w-full h-full">
        <div className="hidden sm:block sm:col-span-1">
          <Results
            usersState={users}
            currentUser={currentUser}
          />
        </div>
        <div className="col-span-3 py-2 flex flex-col items-center px-4">
          <div className="grid grid-cols-4 gap-4 w-full">
            {gameState.cards.map((card, i) => (
              <div
                key={i}
                className={classNames(
                  'bg-gray-200 h-12 w-12 sm:h-16 sm:w-20 rounded-lg shadow-lg shadow-slate-600 flex items-center justify-center text-black ',
                  gameState.selectedCardIds.find((id) => id === card.id)
                    ? 'bg-gray-600 shadow-slate-700 scale-105 cursor-not-allowed hover:none'
                    : 'hover:bg-gray-300 hover:shadow-slate-700 transition duration-200 hover:scale-105 transform cursor-pointer',
                  gameState.selectedCardIds.length === gameState.numOfInputs &&
                    !gameState.selectedCardIds.find((id) => id === card.id) &&
                    'opacity-50 cursor-not-allowed'
                )}
                onClick={() => {
                  if (!gameStarted) return
                  if (
                    gameState.selectedCardIds.length === gameState.numOfInputs
                  )
                    return
                  if (gameState.selectedCardIds.find((id) => id === card.id))
                    return
                  setGameState((state) => ({
                    ...state,
                    selectedCardIds: [...state.selectedCardIds, card.id],
                  }))
                }}
              >
                {card.value ?? '?'}
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-center items-center mt-10 flex-wrap gap-y-2">
            {Array.from({ length: gameState.numOfInputs }).map((_, index) => (
              <div
                key={index}
                className="flex items-center"
              >
                {index > 0 && <span className="mx-2">+</span>}
                <div
                  className={classNames(
                    'text-black bg-white rounded-lg h-12 w-12 sm:h-14 sm:w-16 flex items-center justify-center text-center',
                    gameState.selectedCardIds[index]
                      ? 'bg-gray-200 shadow-slate-600 cursor-pointer hover:bg-gray-300'
                      : 'bg-gray-600 shadow-slate-700',
                    isResetting && 'animate-wiggle'
                  )}
                  onClick={() => {
                    if (gameState.selectedCardIds[index] === undefined) return
                    setGameState((state) => ({
                      ...state,
                      selectedCardIds: state.selectedCardIds.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }}
                >
                  {gameState.cards[gameState.selectedCardIds[index]]?.value}
                </div>
              </div>
            ))}
            <div className="ml-2">= {gameState.expectedResult || '?'}</div>
          </div>
        </div>
      </div>
    </>
  )
}

function Results({
  usersState,
  currentUser,
}: {
  usersState: Player[]
  currentUser: string
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Results</h2>
      <div className="flex flex-col">
        {usersState
          .sort((a, b) => b.score - a.score)
          .map((user) => (
            <div
              key={user.name}
              className={'py-2 flex items-center justify-between relative'}
            >
              {user.name === currentUser && (
                <div className="text-sm absolute -left-6 font-medium text-gray-100">
                  👉
                </div>
              )}
              <div className="flex items-center">
                <div className="">
                  <div className="text-sm font-medium text-gray-100">
                    {user.name}
                    {user.ready && (
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
