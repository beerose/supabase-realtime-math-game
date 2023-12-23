export type GameState = {
  cards: {
    id: number
    value?: number
  }[]
  numOfInputs: number
  selectedCardIds: number[]
  expectedResult: number
  status: 'idle' | 'started' | 'finished'
}

export type Player = {
  name: string
  score: number
  ready?: boolean
}
