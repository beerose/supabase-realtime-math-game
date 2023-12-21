'use client'

import { supabaseClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function NewGamePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sessionStorage.setItem('name', name)

    const insertResult = await supabaseClient.from('results').insert([
      {
        room_name: roomCode,
        name: name,
        result: 0,
      },
    ])

    if (insertResult.error) {
      console.error(insertResult.error)
      return
    }

    router.push(`/${roomCode}`)
  }

  return (
    <form
      className="flex flex-col items-center justify-center mt-8 space-y-4"
      onSubmit={handleSubmit}
    >
      <input
        className="px-8 py-4 bg-white text-black rounded-lg shadow-lg"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="px-8 py-4 bg-white text-black rounded-lg shadow-lg"
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button
        className="mt-4 w-full px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg"
        type="submit"
      >
        Join Game
      </button>
    </form>
  )
}
