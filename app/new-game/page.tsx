'use client'

import { supabaseClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'

export default function NewGamePage() {
  const router = useRouter()
  const [name, setName] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sessionStorage.setItem('name', name)

    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
    })
    const newGame = await supabaseClient
      .from('rooms')
      .insert({
        room_name: randomName,
      })
      .select()
      .single()

    if (newGame.error) {
      console.error(newGame.error)
      return
    }

    const insertResult = await supabaseClient.from('results').insert([
      {
        room_name: newGame.data.room_name || '',
        name: name,
        result: 0,
      },
    ])

    if (insertResult.error) {
      console.error(insertResult.error)
      return
    }

    router.push(`/${newGame.data.room_name}`)
  }

  return (
    <form
      className="flex flex-col items-center justify-center mt-8"
      onSubmit={handleSubmit}
    >
      <input
        className="px-8 py-4 bg-white text-black rounded-lg shadow-lg"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="mt-4 w-full px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg"
        type="submit"
      >
        Start New Game
      </button>
    </form>
  )
}
