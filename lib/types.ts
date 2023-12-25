export type LocalGameBoardState = {
  cards: {
    id: number
    value?: number
  }[]
  numOfInputs: number
  selectedCardIds: number[]
  expectedResult: number
}

export type GameState = {
  status: 'idle' | 'starting' | 'started' | 'finished'
  startTime?: Date
  endTime?: Date
}

export type Player = {
  name: string
  score: number
  ready?: boolean
}
