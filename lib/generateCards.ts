import { LocalGameBoardState } from './types'

export const generateCards = (): Pick<
  LocalGameBoardState,
  'cards' | 'numOfInputs' | 'expectedResult'
> => {
  const cards = []
  for (let i = 0; i < 16; i++) {
    cards.push({
      id: i,
      value: Math.floor(Math.random() * 100),
    })
  }
  const numOfInputs = 3 // Math.floor(Math.random() * 2) + 3, 4 seems to be too hard
  const possibleResults = []

  for (let i = 0; i < 5; i++) {
    let resultCards = [...cards]
    let result = 0
    for (let i = 0; i < numOfInputs; i++) {
      const card =
        resultCards[Math.floor(Math.random() * (resultCards.length - 1))]
      result += card.value
      resultCards = resultCards.filter((c) => c.id !== card.id)
      if (process.env.NODE_ENV === 'development') {
        console.log(card)
      }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(result)
    }
    possibleResults.push(result)
  }

  return {
    cards,
    numOfInputs,
    expectedResult: possibleResults.sort((a, b) => (a > b ? 1 : -1))[0],
  }
}
