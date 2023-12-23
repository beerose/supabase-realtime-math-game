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
