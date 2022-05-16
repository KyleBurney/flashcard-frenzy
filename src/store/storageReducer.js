import * as allActions from './actionTypes';
import * as FileSystem from 'expo-file-system';

export default function storage(state = { flashCards: {}, settings: { background: "notepad", frontSideColor: "#d3e6ff", backSideColor: "#005c96", numCardsPerRow: 2 } }, action) {
  switch (action.type) {
    case allActions.ADD_FLASHCARD:
      var newCards = { ...state.flashCards }
      newCards[action.category].cards.push(action.data)
      return { ...state, flashCards: newCards };

    case allActions.UPDATE_FLASHCARD:
      var newCards = { ...state.flashCards }
      if (newCards[action.category].cards[action.index][action.side].includes("file://")) {
        FileSystem.deleteAsync(newCards[action.category].cards[action.index][action.side], {}).then(() => {
          console.log("deleted image")
        }).catch(err => {
          console.log("err", err)
        })
      }
      newCards[action.category].cards[action.index] = action.data
      return { ...state, flashCards: newCards };

    case allActions.DELETE_FLASHCARD:
      var newCards = { ...state.flashCards }
      if (newCards[action.category].cards[action.index].frontSide.includes("file://")) {
        FileSystem.deleteAsync(newCards[action.category].cards[action.index].frontSide, {}).then(() => {
          console.log("deleted frontside image")
        }).catch(err => {
          console.log("err", err)
        })
      }
      if (newCards[action.category].cards[action.index].backSide.includes("file://")) {
        FileSystem.deleteAsync(newCards[action.category].cards[action.index].backSide, {}).then(() => {
          console.log("deleted backside image")
        }).catch(err => {
          console.log("err", err)
        })
      }
      newCards[action.category].cards.splice(action.index, 1)
      return { ...state, flashCards: newCards };

    case allActions.SET_CATEGORY:
      if (state.flashCards[action.data] == null) {
        var newCards = {
          ...state.flashCards, [action.data]: {
            cards: [],
            quizzes: {
              timedChallenge: { highScore: "" },
              matchCards: { highScore: "" },
              typeTheAnswer: { highScore: "" }
            }
          }
        }
        return { ...state, flashCards: newCards };
      }
      return { ...state };

    case allActions.UPDATE_CATEGORY:
      var newCards = { ...state.flashCards }
      newCards[action.newCategory] = newCards[action.oldCategory]
      delete newCards[action.oldCategory]
      return { ...state, flashCards: newCards };

    case allActions.DELETE_CATEGORY:
      var newCards = { ...state.flashCards }
      newCards[action.data].cards.forEach(card => {
        if (card.frontSide.includes("file://")) {
          FileSystem.deleteAsync(card.frontSide, {}).then(() => {
            console.log("deleted frontside image")
          }).catch(err => {
            console.log("err", err)
          })
        }
        if (card.backSide.includes("file://")) {
          FileSystem.deleteAsync(card.backSide, {}).then(() => {
            console.log("deleted backside image")
          }).catch(err => {
            console.log("err", err)
          })
        }
      })

      delete newCards[action.data]
      return { ...state, flashCards: newCards };

    case allActions.UPDATE_HIGH_SCORE:
      var newCards = { ...state.flashCards }
      newCards[action.category].quizzes[action.quiz].highScore = action.score
      return { ...state, flashCards: newCards };

    case allActions.UPDATE_BACKGROUND:
      return { ...state, settings: { ...state.settings, background: action.background } };

    case allActions.UPDATE_CARD_COLOR:
      return { ...state, settings: { ...state.settings, frontSideColor: action.frontSideColor, backSideColor: action.backSideColor } };

    case allActions.UPDATE_NUM_CARDS_PER_ROW:
      return { ...state, settings: { ...state.settings, numCardsPerRow: action.numCardsPerRow } };

    default:
      return state;
  }
}
