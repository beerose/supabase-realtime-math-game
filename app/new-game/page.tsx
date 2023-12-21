'use client'

import { FormEvent, useState } from 'react'

export default function NewGamePage() {
  const [name, setName] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sessionStorage.setItem('name', name)
    const gameId = Math.random().toString(36).substring(7)
    // TODO: create room in supabase

    window.location.href = `/${gameId}`
  }

  return (
    <form
      className="flex flex-col items-center justify-center mt-8"
      onSubmit={handleSubmit}
    >
      <input
        className="px-8 py-4 bg-white text-black rounded-lg shadow-lg"
        placeholder="Your Name"
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
